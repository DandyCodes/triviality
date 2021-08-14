const { randomRangeInt, delay } = require("../utils/helpers");
const profanityFilter = require("../utils/profanity-filter");
const Quiz = require("./quiz");

const ioServer = {
  io: null,
  lobbyIDLength: 4,
  quizIDLength: 10,

  config(_io) {
    this.io = _io;
    this.io.on("connection", async socket => {
      socket.on("nicknameProvided", nickname => {
        socket.nickname = nickname;

        socket.on("createLobby", async () => {
          const lobby = this.generateUniqueRoom(this.lobbyIDLength);
          socket.createdLobby = lobby;
          await this.putSocketInRoom(socket, lobby);
        });

        socket.on("joinLobby", async lobby => {
          if (socket.rooms.has(lobby)) return;
          if (!this.getAllRooms().includes(lobby)) return;
          await this.putSocketInRoom(socket, lobby);
        });

        socket.on(
          "startQuiz",
          async ({ questions, rounds, timeLimit, roundBreak, lobby }) => {
            const quizRoom = this.generateUniqueRoom(this.quizIDLength);
            const sockets = this.getSockets(lobby);
            const nicknames = this.getUniqueNicknames(sockets);
            const participants = nicknames.map(nickname => ({
              nickname,
              score: 0,
              hasResponded: false,
              hasPassed: false,
              correct: false,
            }));
            const quiz = new Quiz(
              this.io,
              sockets,
              participants,
              quizRoom,
              questions,
              rounds,
              timeLimit,
              roundBreak
            );
            for (const socket of sockets) {
              await this.putSocketInRoom(socket, quizRoom);
              await socket.emit("quizJoined", quiz.getQuizState());
            }
            await delay(100);
            quiz.start();
          }
        );

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
    await delay(100);
    if (room.length === this.lobbyIDLength) {
      const lobby = room;
      await socket.emit("lobbyJoined", this.getLobbyState(lobby));
      await this.io.to(lobby).emit("updateLobby", this.getLobbyState(lobby));
    }
  },

  getLobbyState(lobby) {
    const sockets = this.getSockets(lobby) ?? [];
    const nicknames = this.getUniqueNicknames(sockets);
    const creator = sockets.find(
      socket => socket.createdLobby === lobby
    )?.nickname;
    return {
      nicknames,
      creator: creator,
      lobby,
    };
  },

  async leaveAllRoomsAndNotify(socket) {
    if (!socket) return;
    const rooms = socket.rooms ?? new Set();
    for (const room of rooms) {
      if (room.length === 20) continue;
      await socket.leave(room);
      if (room.length === this.lobbyIDLength) {
        const lobby = room;
        await this.io.to(lobby).emit("updateLobby", this.getLobbyState(lobby));
      }
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
