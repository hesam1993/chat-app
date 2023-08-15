import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ChatRoom({ getInfo, socket, messages, locationMessages, roomUsers }) {
  const [_username, _room] = getInfo();
  const [username, setUsername] = useState(_username);
  const [room, setRoom] = useState(_room);
  const [users, setUsers] = useState([]);
  const [msgInputValue, setMsgInputValue] = useState('');
  const [cLocationMessages, setCLocationMessages] = useState([]);
  const [cMessages, setCMessages] = useState(messages);
  const [croomUsers, setCRoomUsers] = useState(roomUsers);
  // const $messageFormInput = $messageForm.querySelector("input");
  // const $messageFormButton = $messageForm.querySelector("button");

  useEffect(() => {
    setCMessages(messages)
  }, [messages])

  useEffect(() => {
    // autoscroll();
    setCLocationMessages(locationMessages)

  }, [locationMessages])

  useEffect(() => {
    // autoscroll();
    setCRoomUsers(roomUsers)

  }, [roomUsers])


  const autoscroll = () => {
    //new message element
    const $messages = document.querySelector("#messages");
    const $newMessage = $messages.lastElementChild;

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = $messages.offsetHeight;

    //Height of messages container
    const containerHeight = $messages.scrollHeight;

    //How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
      $messages.scrollTop = $messages.scrollHeight;
    }
  };
  const sendLocation = () => {
    if (!navigator.geolocation) {
      return alert("geo location is not supported ");
    }

    const $locationBtn = document.querySelector("#send-location");
    $locationBtn.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "send-location",
        {
          latitude: position.coords.longitude,
          longitude: position.coords.latitude,
        },
        username
        ,
        () => {
          console.log("Location is shared");
          $locationBtn.removeAttribute("disabled");
        }
      );
    });
  }
  const sendMessage = (e) => {
    e.preventDefault();

    socket.emit("client-message", msgInputValue, username, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message is received by the server!");
    });
    setMsgInputValue('');
  }

  const onInputChange = (e) => {
    setMsgInputValue(e.target.value);
  }


  // const setServerMessageSokcet = useCallback(()=>{

  // }, [])

  return (
    <>
      <div className="chat">
        <div className="chat__sidebar" id="sidebar-template" type="text/html">
          <h2 className="room-title">{room}</h2>
          <h3 className="list-title">Users</h3>
          <ul className="users">
            {croomUsers && croomUsers.map(user => <li>{user.username}</li>)}
          </ul>
        </div>
        <div className="chat__main">
          <div id="messages" className="chat__messages">
            {cMessages.map(message => {
              return (
                <div id="message-template" type="text/html" key={message.id}>
                  <div className="message">
                    <p>
                      <span className="message__name">{message.username}</span>
                      <span className="message_meta">{message.createdAt}</span>
                    </p>
                    <p>{message.text}</p>
                  </div>
                </div>
              )
            })}

            {cLocationMessages.map(locMessage => {
              return (
                <div id="location-template" type="text/html">
                  <div>
                    <p>
                      <span className="message__name">{locMessage.username}</span>
                      <span className="message_meta">{locMessage.createdAt}</span>
                    </p>
                    <p><a target="_blank" rel="noreferrer" href={locMessage.text}>{locMessage.username} Location</a></p>
                  </div>
                </div>
              )
            })}



          </div>
          <div className="compose">
            <form id="message-form">
              <input type="text" id="msg" value={msgInputValue} onChange={(e) => { onInputChange(e) }} required autoComplete="off" />
              <button id="sendBtn" onClick={(e) => { sendMessage(e) }}>send message</button>
            </form>

            <button id="send-location" onClick={sendLocation}>Send Location</button>
          </div>

        </div>
      </div>






    </>
  );

}

export default ChatRoom;
