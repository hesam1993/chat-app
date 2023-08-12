import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ChatRoom({socket}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUsername] = useState(searchParams.get("username"));
  const [room, setRoom] = useState(searchParams.get("room"));
  const navigate = useNavigate()
  socket.emit("join", { username, room }, (error) => {
    if (error) {
      alert(error);
      navigate(`/`)
    }
  });
  useEffect(() => {
    
  }, []);
  return <h1>this is the chat room</h1>;
}

export default ChatRoom;
