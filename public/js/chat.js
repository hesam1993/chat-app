//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  //new message element
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

socket.on("location-message", (locationMessage) => {
  console.log(locationMessage);
  const html = Mustache.render(locationTemplate, {
    username: locationMessage.username,
    locationMessage: locationMessage.text,
    createdAt: moment(locationMessage.createdAt).format("hh:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("server-message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("hh:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  console.log(room, users);
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

const submitBtn = document.querySelector("#sendBtn");
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  //disable
  $messageFormButton.setAttribute("disabled", "disabled");

  const msg = document.querySelector("#msg").value;
  socket.emit("client-message", msg, (error) => {
    //enable
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message is received by the server!");
  });
});

$locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geo location is not supported ");
  }
  $locationBtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "send-location",
      {
        latitude: position.coords.longitude,
        longitude: position.coords.latitude,
      },
      () => {
        console.log("Location is shared");
        $locationBtn.removeAttribute("disabled");
      }
    );
  });
});

socket.on("last-messages", (lastMessages) => {
  for ( message of lastMessages ){
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("hh:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
    console.log(message.createdAt);
  }

  console.log(lastMessages);
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
