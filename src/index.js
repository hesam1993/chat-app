const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser,
} = require("./utils/users");
const { generateMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    console.log(username, room);
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit(
      "server-message",
      generateMessage("Admin", `Welcome ${username}`)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "server-message",
        generateMessage("Admin", `${user.username} has joined the room!`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //sending client message to everyone in the room
  socket.on("client-message", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "server-message",
      generateMessage(user.username, message)
    );
    callback();
  });

  socket.on("send-location", (position, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "location-message",
      generateMessage(
        user.username,
        `https://google.com/maps?q=${position.longitude},${position.latitude}`
      )
    );
    callback();
  });

  //informing everyone that someone has left the room
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "server-message",
        generateMessage("Admin", `${user.username} has left`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
