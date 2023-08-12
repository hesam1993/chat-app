import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import ChatRoom from "./Components/ChatRoom";
import io from "socket.io-client";


function App() {
  const socket = io.connect("http://localhost:5000");
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login socket={socket} />} />
          <Route index element={<Login socket={socket} />} />
          <Route path="chat-room" element={<ChatRoom socket={socket} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
