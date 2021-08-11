const chalk = require("chalk");
const { randomRangeInt } = require("../utils/helpers");
const profanityFilter = require("../utils/profanity-filter");

const ioServer = {
  io: null,

  config(io) {
    this.io = io;
    this.io.on("connection", async socket => {
      console.log(`Client ${chalk.blueBright(socket.id)} connected`);
      await socket.emit("getNickname", "Connected");

      socket.on("sendNickname", nickname => {
        socket.nickname = nickname;
      });

      socket.on("joinRoom", async ({ roomId, nickname }) => {
        socket.nickname = nickname;
        for (const room of socket.rooms) {
          if (room.length < 20 && room !== roomId) {
            await socket.leave(room);
          }
        }
        await socket.join(roomId);
      });
    });
  },

  getRoomIds() {
    const roomIds = Array.from(this.io.sockets.adapter.rooms.keys());
    return roomIds.filter(room => room.length < 20);
  },

  getSocketsInRoom(roomId) {
    let sockets = [];
    const socketIdsInRoom = Array.from(
      this.io.sockets.adapter.rooms.get(roomId)
    );
    for (const socketId of socketIdsInRoom) {
      const socket = this.io.sockets.sockets.get(socketId);
      sockets.push(socket);
    }
    return sockets;
  },

  getNicknamesInRoom(roomId) {
    nicknames = new Set();
    const sockets = this.getSocketsInRoom(roomId);
    for (const socket of sockets) {
      nicknames.add(socket.nickname);
    }
    return nicknames;
  },

  getSocketFromNickname(nickname) {
    if (!nickname) return;
    for (const key of this.io.sockets.sockets.keys()) {
      const socket = this.io.sockets.sockets.get(key);
      const socketNickname = socket.nickname;
      if (socketNickname === nickname) {
        return socket;
      }
    }
  },

  generateUniqueRoomId(length) {
    let roomId;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let uniqueAndNotProfane = false;
    while (!uniqueAndNotProfane) {
      roomId = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = randomRangeInt(0, characters.length);
        roomId += characters[randomIndex];
      }
      if (
        !this.getRoomIds().includes(roomId) &&
        !profanityFilter.isProfane(roomId)
      ) {
        uniqueAndNotProfane = true;
      }
    }
    return roomId;
  },
};

module.exports = ioServer;
