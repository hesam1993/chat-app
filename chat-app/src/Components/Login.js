import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";

function Login({ setInfo, socket }) {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.emit("room-list-request", () => { });
    socket.on("room-list-respond", (roomList) => {
      for (const room of roomList) {
        console.log(room);
      }
    });
  }, [])

  const inputHandler = (e) => {
    const id = e.target.id;
    if (id === "username") {
      setUsername(e.target.value);
    } else if (id === "room") {
      setRoom(e.target.value);
    }
  };
  const submitHandler = () => {
    socket.emit("join", { username, room }, (error) => {
      if (error) {
        alert(error);
        navigate(`/`)
      }
    });
    setInfo(username, room);
    navigate(`/chat-room`);
  }
  return (
    <>
      <div className="centered-form">
        <div className="centered-form__box">
          <h1>Join</h1>
          <form
            onSubmit={submitHandler}
          >
            <label for="username"></label>
            <input
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              onChange={(e) => inputHandler(e)}
              required
            />
            <label for="room"></label>
            <input
              placeholder="Room's name"
              type="text"
              list="roomItems"
              name="room"
              id="room"
              onChange={(e) => inputHandler(e)}
              required
            />
            <datalist id="roomItems"></datalist>
            <button>Join</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
