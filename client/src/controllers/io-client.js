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

socket.on("updateRoom", async ({ nicknames, creator }) => {
  const decoded = await clientAuth.getDecodedToken();
  const updateRoomEvent = new CustomEvent("updateRoom", {
    detail: { nicknames, isCreator: creator === decoded?.data?.nickname },
  });
  window.dispatchEvent(updateRoomEvent);
});

socket.on("quizJoined", room => {
  ioClient._currentRoom = room;
  const quizJoinedEvent = new CustomEvent("quizJoined", { detail: { room } });
  window.dispatchEvent(quizJoinedEvent);
});

socket.on("confirmReadyToStartQuiz", () => {
  socket.emit("readyToStartQuiz");
});

socket.on("updateQuiz", quizState => {
  const updateQuizEvent = new CustomEvent("updateQuiz", { detail: quizState });
  window.dispatchEvent(updateQuizEvent);
});

socket.on("askQuestion", question => {
  const askQuestionEvent = new CustomEvent("askQuestion", { detail: question });
  window.dispatchEvent(askQuestionEvent);
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

  startQuiz(questions, rounds) {
    socket.emit("startQuiz", { questions, rounds, room: this._currentRoom });
  },
};

export default ioClient;
