const socket = io();
const sendBtn = document.querySelector("#send-message");
const message = document.querySelector("#message");
const messages = document.querySelector("#messages");
const sendLocationBtn = document.querySelector("#send-location");

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("server-message", (message) => {
  console.log(message);
  const messageEl = document.createElement("p");
  const date = moment(message.createdAt).format("ddd, hh:mm");
  messageEl.innerHTML = `${message.username} - ${date} <br> ${message.text}`;
  messages.insertAdjacentElement("beforeend", messageEl);
  resetMessageForm();
});

socket.on("roomData", (roomData) => {
  console.log(roomData);
});

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("client-message", message.value, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message is received by the server");
  });
});

sendLocationBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("geo location is not supported");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "send-location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("Location is shared");
      }
    );
  });
});

socket.on("location-message", (locationMessage) => {
  console.log(locationMessage);
  const messageEl = document.createElement("p");
  const date = moment(locationMessage.createdAt).format("ddd, hh:mm");
  messageEl.innerHTML = `${locationMessage.username} - ${date} <br> ${locationMessage.text}`;
  messages.insertAdjacentElement("beforeend", messageEl);
  resetMessageForm();
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

const resetMessageForm = () => {
  message.value = "";
  message.focus();
};
