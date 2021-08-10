const chalk = require("chalk");
const { randomRangeInt } = require("../utils/helpers");

const ioServerController = {
  io: null,

  config(io) {
    this.io = io;
    this.io.on("connection", async socket => {
      console.log(`Client ${chalk.blueBright(socket.id)} connected`);
      await socket.emit("privateMessage", "Connected");

      socket.on("joinRoom", async ({ roomId, name }) => {
        socket.name = name;
        for (const room of socket.rooms) {
          if (room.length < 20 && room !== roomId) {
            await socket.leave(room);
          }
        }
        await socket.join(roomId);
      });
    });
  },

  getRooms() {
    const rooms = Array.from(this.io.sockets.adapter.rooms.keys());
    return rooms.filter(room => room.length < 20);
  },

  getUsersInRoom(roomId) {
    const socketIds = Array.from(this.io.sockets.adapter.rooms.get(roomId));
    let names = [];
    for (const socketId of socketIds) {
      const socket = this.io.sockets.sockets.get(socketId);
      names.push(socket.name);
    }
    return names;
  },

  generateUniqueRoomId(length) {
    let roomId;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let unique = false;
    while (!unique) {
      roomId = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = randomRangeInt(0, characters.length);
        roomId += characters[randomIndex];
      }
      if (!this.getRooms().includes(roomId)) {
        unique = true;
      }
    }
    return roomId;
  },
};

module.exports = ioServerController;
