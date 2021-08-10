import clientAuth from "../utils/client-auth";
import socketClient from "socket.io-client";
const socket = socketClient();
socket.on("privateMessage", message => {
  console.log(message);
});

const ioClient = {
  async joinRoom(roomId) {
    const decoded = await clientAuth.getDecodedToken();
    const nickname = decoded?.data?.nickname;
    socket.emit("joinRoom", { roomId, nickname });
  },
};

export default ioClient;
