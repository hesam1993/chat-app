import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import ChatRoom from "./Components/ChatRoom";
import io from "socket.io-client";
import { useState } from "react";


function App() {
  const socket = io.connect("http://localhost:5000");
  const [username, setUsername] = useState()
  const [room, setRoom] = useState()
  const setInfo = (username, room) => {
    setRoom(room)
    setUsername(username)
  }
  const getInfo = ()=>{
    return [username, room]
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setInfo={setInfo} socket={socket} />} />
          <Route index element={<Login setInfo={setInfo} socket={socket} />} />
          <Route path="chat-room" element={<ChatRoom getInfo={getInfo} socket={socket} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
