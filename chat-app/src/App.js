import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import ChatRoom from "./Components/ChatRoom";
import io from "socket.io-client";
import { useEffect, useState } from "react";


function App() {
  const [socket, setSocket] = useState(io.connect("http://localhost:5000"));
  const [username, setUsername] = useState();
  const [room, setRoom] = useState();
  const [privateRoom, setPrivateRoom] = useState();
  const [messages, setMessages] = useState([]);
  const [locationMessages, setLocationMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    socket.on("location-message", (locationMessage) => {
      setLocationMessages( current => [ ...current, locationMessage]);
      console.log(locationMessage)
    });

    socket.on("last-messages", async (message) => {
      setMessages(current => [...current, ...message])
    })

    socket.on("server-message", async (message) => {
      setMessages(current => [...current, message])
    })

    socket.on("room-data", async (roomUsers) => {
      setRoomUsers(roomUsers.users)
    })
  }, [])
  const setInfo = (username, room, privateRoom) => {
    setRoom(room)
    setUsername(username)
    setPrivateRoom(privateRoom)
  }
  const getInfo = () => {
    return [username, room]
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setInfo={setInfo} socket={socket} />} />
          <Route index element={<Login setInfo={setInfo} socket={socket} />} />
          <Route path="chat-room" element={<ChatRoom roomUsers={roomUsers} locationMessages={locationMessages} messages={messages} getInfo={getInfo} socket={socket} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
