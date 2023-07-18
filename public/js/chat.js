const socket = io();
const sendBtn = document.querySelector("#send-message");
const message = document.querySelector("#message");
const messages = document.querySelector("#messages");

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("server-message", (message) => {
  console.log(message);
  const messageEl = document.createElement("p");
  messageEl.innerHTML = message;
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

socket.emit("join", { username, room }, (error) => {
  alert(error);
  location.href = "/";
});

const resetMessageForm = () => {
  message.value = "";
  message.focus();
};
