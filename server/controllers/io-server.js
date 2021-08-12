const { randomRangeInt } = require("../utils/helpers");
const profanityFilter = require("../utils/profanity-filter");
const Quiz = require("./quiz");

const ioServer = {
  io: null,
  IDLength: 4,
  quizIDLength: 10,

  config(_io) {
    this.io = _io;
    this.io.on("connection", async socket => {
      socket.on("nicknameProvided", nickname => {
        socket.nickname = nickname;

        socket.on("createRoom", async () => {
          const room = this.generateUniqueRoom(this.IDLength);
          socket.createdRoom = room;
          await this.putSocketInRoom(socket, room);
        });

        socket.on("joinRoom", async room => {
          if (socket.rooms.has(room)) return;
          if (!this.getAllRooms().includes(room)) return;
          await this.putSocketInRoom(socket, room);
        });

        socket.on("startQuiz", async ({ questions, rounds, room }) => {
          const quizRoom = this.generateUniqueRoom(this.quizIDLength);
          const sockets = this.getSockets(room);
          for (const socket of sockets) {
            await this.putSocketInRoom(socket, quizRoom);
          }
          const nicknames = this.getUniqueNicknames(sockets);
          const participants = nicknames.map(nickname => ({
            nickname,
            score: 0,
          }));
          const quiz = new Quiz(
            this.io,
            sockets,
            participants,
            quizRoom,
            questions,
            rounds
          );
          quiz.Start();
        });

        socket.on("disconnecting", async () => {
          await this.leaveAllRoomsAndNotify(socket);
        });
      });

      socket.emit("askNickname");
    });
  },

  async putSocketInRoom(socket, room) {
    await this.leaveAllRoomsAndNotify(socket);
    await socket.join(room);
    if (room.length === this.IDLength) {
      await socket.emit("roomJoined", room);
      await this.io.to(room).emit("updateRoom", this.getRoomState(room));
    }
    if (room.length === this.quizIDLength) {
      await socket.emit("quizJoined", room);
    }
  },

  getRoomState(room) {
    const sockets = this.getSockets(room) ?? [];
    const nicknames = this.getUniqueNicknames(sockets);
    const creator = sockets.find(
      socket => socket.createdRoom === room
    )?.nickname;
    return {
      nicknames,
      creator: creator,
    };
  },

  async leaveAllRoomsAndNotify(socket) {
    if (!socket) return;
    const rooms = socket.rooms ?? new Set();
    for (const room of rooms) {
      if (room.length === 20) continue;
      await socket.leave(room);
      await this.io.to(room).emit("updateRoom", this.getRoomState(room));
    }
  },

  getUniqueNicknames(sockets) {
    let nicknames = new Set();
    if (sockets) {
      for (const socket of sockets) {
        if (!socket.nickname) continue;
        nicknames.add(socket.nickname);
      }
    }
    return Array.from(nicknames);
  },

  getSockets(room) {
    let sockets = [];
    const socketIds = this.io.sockets.adapter.rooms.get(room) ?? new Set();
    for (const socketId of socketIds) {
      const socket = this.io.sockets.sockets.get(socketId);
      sockets.push(socket);
    }
    return sockets;
  },

  getAllRooms() {
    return Array.from(this.io.sockets.adapter.rooms.keys()).filter(
      room => room.length < 20
    );
  },

  generateUniqueRoom(length) {
    let room;
    const rooms = this.getAllRooms();
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let isInUse = true;
    let isProfane = true;
    while (isInUse || isProfane) {
      room = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = randomRangeInt(0, characters.length);
        room += characters[randomIndex];
      }
      if (!rooms.includes(room)) {
        isInUse = false;
      }
      if (!profanityFilter.isProfane(room)) {
        isProfane = false;
      }
    }
    return room;
  },
};

module.exports = ioServer;
