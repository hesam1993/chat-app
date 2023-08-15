import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Login({ setInfo, socket }) {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [privateRoom, setPrivateRoom] = useState(false);
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
    socket.emit("join", { username, room, privateRoom }, (error) => {
      if (error) {
        alert(error);
        navigate(`/`)
      }
    });
    setInfo(username, room, privateRoom);
    navigate(`/chat-room`);
  }
  const privateRoomHandler = ()=>{
    setPrivateRoom(!privateRoom)
  }
  return (
    <>
      <div className="centered-form">
        <div className="centered-form__box">
          <h1>Join</h1>
          <form
            onSubmit={submitHandler}
          >
            <input
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              onChange={(e) => inputHandler(e)}
              required
            />
            <input
              placeholder="Room's name"
              type="text"
              list="roomItems"
              name="room"
              id="room"
              onChange={(e) => inputHandler(e)}
              required
            />
            <div className="form-row">
            <input type="checkbox" onChange={privateRoomHandler}  id="privateRoom" name="privateRoom" value="true"/>
            <label htmlFor="privateRoom">Private Room</label>
            </div>
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
