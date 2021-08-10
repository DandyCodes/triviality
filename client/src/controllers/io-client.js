import clientAuth from "../utils/client-auth";
import socketClient from "socket.io-client";
const socket = socketClient();
socket.on("privateMessage", message => {
  console.log(message);
});

const ioClientController = {
  async joinIoRoom(roomId) {
    const decoded = await clientAuth.getDecodedToken();
    const name = decoded?.data?.name;
    socket.emit("joinRoom", { roomId, name });
  },
};

export default ioClientController;
