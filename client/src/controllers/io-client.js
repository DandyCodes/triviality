import clientAuth from "../utils/client-auth";
import socketClient from "socket.io-client";
const socket = socketClient();

socket.on("askNickname", async () => {
  const decoded = await clientAuth.getDecodedToken();
  socket.emit("nicknameProvided", decoded?.data?.nickname);
});

socket.on("roomJoined", room => {
  ioClient._currentRoom = room;
  const roomJoinedEvent = new CustomEvent("roomJoined", { detail: { room } });
  window.dispatchEvent(roomJoinedEvent);
});

socket.on("updateRoom", () => {
  const updateRoomEvent = new CustomEvent("updateRoom");
  window.dispatchEvent(updateRoomEvent);
});

const ioClient = {
  _currentRoom: "",

  createRoom() {
    socket.emit("createRoom");
  },

  joinRoom(room) {
    socket.emit("joinRoom", room);
  },

  isInRoom(room) {
    return room === this._currentRoom;
  },
};

export default ioClient;
