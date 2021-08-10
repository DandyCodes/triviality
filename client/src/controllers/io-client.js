import clientAuth from "../utils/client-auth";
import socketClient from "socket.io-client";
const socket = socketClient();
socket.on("getNickname", async message => {
  console.log(message);
  const decoded = await clientAuth.getDecodedToken();
  const nickname = decoded?.data?.nickname;
  socket.emit("sendNickname", nickname);
});

const ioClient = {
  async joinRoom(roomId) {
    const decoded = await clientAuth.getDecodedToken();
    const nickname = decoded?.data?.nickname;
    socket.emit("joinRoom", { roomId, nickname });
  },
};

export default ioClient;
