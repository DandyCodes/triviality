import socketClient from "socket.io-client";
const socket = socketClient();
socket.on("privateMessage", msg => console.log(msg));
socket.on("messageAll", msg => console.log(msg));

export const messageAll = msg => {
  socket.emit("messageAll", msg);
};
