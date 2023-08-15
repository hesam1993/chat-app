import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Login({ setInfo, socket }) {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setSocketCalls()
  }, [])

  const setSocketCalls = useCallback(() => {
    socket.emit("room-list-request", () => { });
    socket.on("room-list-respond", (roomList) => {
      let tempRooms = [];
      for (const room of roomList) {
          tempRooms.push(room);
      }
      setRooms([...tempRooms])
    })
  },[])

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
            <datalist id="roomItems">
              {rooms.length > 0 && rooms.map(room => <option key={room} value={room}>{room}</option>)}
            </datalist>
            <button>Join</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
