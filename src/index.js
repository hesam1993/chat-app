const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.use(cors())
require("./db/mongoose");
const Message = require("./models/message");
const User = require("./models/user");
const { generateMessage } = require("./utils/messages");


const port = process.env.PORT || 5000;
io.on("connection", (socket) => {
  socket.on("join", async ({ username, room }, callback) => {
    socket.join(room);

    const lastMessages = await Message.find({ room });
    socket.emit("last-messages", lastMessages);
    socket.emit(
      "server-message",
      generateMessage("Admin", `Welcome ${username}`)
    );
    io.to(room)
      .emit(
        "server-message",
        generateMessage("Admin", `${username} has joined the room!`)
      );

    const currentUser = await User.findOne({ username });
    if ( currentUser && currentUser.length === 1) {
      currentUser.room = room;
      currentUser.socketId = socket.id;
      await currentUser.save();
    } else if (currentUser === null) {
      const newUser = new User({ socketId: socket.id, username, room });

      try {
        await newUser.save();
      } catch (e) {
        console.log(e);
      }
    }

    const currentUsers = await User.find({ room });
    io.to(room).emit("room-data", {
      room: room,
      users: currentUsers,
    });


    callback();
  });

  //sending client message to everyone in the room
  socket.on("client-message", async (message, username, callback) => {
    const user = await User.findOne({ username });
    user.socketId = socket.id;
    socket.join(user.room);
    await user.save();
    // const newMessage = generateMessage(user.username, message);

    const newMessage = new Message({
      text: message,
      username: user.username,
      room: user.room,
      createdAt: new Date().getTime(),
    });

    try {
      await newMessage.save();
    } catch (e) {
      console.log(e);
    }
    io.to(user.room).emit("server-message", newMessage);
    callback();
  });

  socket.on("send-location", async (position, username, callback) => {
    const user = await User.findOne({ username });
    user.socketId = socket.id;
    socket.join(user.room);
    await user.save();
    io.to(user.room).emit(
      "location-message",
      generateMessage(
        user.username,
        `https://google.com/maps?q=${position.longitude},${position.latitude}`
      )
    );
    callback();
  });

  socket.on("room-list-request", async () => {
    const allRooms = await User.distinct("room");
    io.emit("room-list-respond", allRooms);
  });

  //informing everyone that someone has left the room
  socket.on("disconnect", async () => {
    const user = await User.findOneAndDelete({ socketId: socket.id });
    // const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "server-message",
        generateMessage("Admin", `${user.username} has left`)
      );
      const currentUsers = await User.find({ room: user.room });
      io.to(user.room).emit("room-data", {
        room: user.room,
        users: currentUsers,
      });

      //if there is no one in the room, all the messages of that room will be deleted
      if (currentUsers.length === 0) {
        await Message.find({ room: user.room }).deleteMany();
      }
    }
  });
});

http.listen(port, () => {
  console.log("Server is running on port " + port);
});
