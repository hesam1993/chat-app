const socket = io();
const roomItems = document.getElementById("roomItems");
if( roomItems ){
    socket.emit("room-list-request", () => {});
    socket.on("room-list-respond", (roomList) => {
      for (const room of roomList) {
        
        roomItems.insertAdjacentHTML(
          "beforeend",
          ` <option value=${room}>${room}</option>`
        );
      }
    });
}

