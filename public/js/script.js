const socket = io();
socket.emit("room-list-request", () => {});
socket.on("room-list-respond", (roomList) => {
  for (const room of roomList) {
    const roomItems = document.getElementById("roomItems");
    roomItems.insertAdjacentHTML(
      "beforeend",
      ` <option value=${room}>${room}</option>`
    );
  }
});
