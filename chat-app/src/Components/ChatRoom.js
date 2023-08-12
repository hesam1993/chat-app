import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ChatRoom({ getInfo, socket }) {
  const [_username, _room] = getInfo();
  const [username, setUsername] = useState(_username);
  const [room, setRoom] = useState(_room);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [locationMessages, setLocationMessages] = useState([]);
  const $messageForm = document.querySelector("#message-form");
  // const $messageFormInput = $messageForm.querySelector("input");
  // const $messageFormButton = $messageForm.querySelector("button");



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
    // const $messageFormButton = $messageForm.querySelector("#sendBtn");
    // const $messageFormInput = $messageForm.querySelector("#msg");
    // $messageFormButton.setAttribute("disabled", "disabled");

    const msg = document.querySelector("#msg").value;
    socket.emit("client-message", msg, username, (error) => {
      //enable
      // $messageFormButton.removeAttribute("disabled");
      // $messageFormInput.value = "";
      // $messageFormInput.focus();
      if (error) {
        return console.log(error);
      }
      console.log("Message is received by the server!");
    });
  }


  useEffect(() => {
    socket.on("location-message", (locationMessage) => {
      console.log(locationMessage);
      // const html = Mustache.render(locationTemplate, {
      //   username: locationMessage.username,
      //   locationMessage: locationMessage.text,
      //   createdAt: moment(locationMessage.createdAt).format("hh:mm a"),
      // });
      // $messages.insertAdjacentHTML("beforeend", html);
      // autoscroll();
    });

    socket.on("server-message", (message) => {
      console.log(message);
      setMessages(current => [...current, message]);
      console.log(messages)
      // autoscroll();
    });
  }, [])


  return (
    <>
      <div className="chat">
        <div className="chat__sidebar" id="sidebar-template" type="text/html">
          <h2 className="room-title">{room}</h2>
          <h3 className="list-title">Users</h3>
          <ul className="users">
            {users.map(user => <li>USER1</li>)}
          </ul>
        </div>
        <div className="chat__main">
          <div id="messages" className="chat__messages">
            {messages.map(message => {
              return (
                <div id="message-template" type="text/html">
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

            {locationMessages.map(locMessage => {
              return (
                <div id="location-template" type="text/html">
                  <div>
                    <p>
                      <span className="message__name">{locMessage.username}</span>
                      <span className="message_meta">{locMessage.createdAt}</span>
                    </p>
                    <p><a target="_blank" href="#LOCATIONMESSAGE">{locMessage.username} Location</a></p>
                  </div>
                </div>
              )
            })}



          </div>
          <div className="compose">
            <form id="message-form">
              <input type="text" id="msg" required autoComplete="off" />
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
