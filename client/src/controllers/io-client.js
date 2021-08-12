import clientAuth from "../utils/client-auth";
import socketClient from "socket.io-client";
const socket = socketClient();

socket.on("askNickname", async () => {
  const decoded = await clientAuth.getDecodedToken();
  socket.emit("nicknameProvided", decoded?.data?.nickname);
});

socket.on("lobbyJoined", lobbyState => {
  ioClient.currentRoom = lobbyState.lobby;
  const lobbyJoinedEvent = new CustomEvent("lobbyJoined", {
    detail: lobbyState,
  });
  window.dispatchEvent(lobbyJoinedEvent);
});

socket.on("updateLobby", async lobbyState => {
  const decoded = await clientAuth.getDecodedToken();
  const updateLobbyEvent = new CustomEvent("updateLobby", {
    detail: {
      ...lobbyState,
      isCreator: lobbyState.creator === decoded?.data?.nickname,
    },
  });
  window.dispatchEvent(updateLobbyEvent);
});

socket.on("quizJoined", quizState => {
  ioClient.currentRoom = quizState.room;
  const quizJoinedEvent = new CustomEvent("quizJoined", { detail: quizState });
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
  currentRoom: "",

  createLobby() {
    socket.emit("createLobby");
  },

  joinLobby(lobby) {
    socket.emit("joinLobby", lobby);
  },

  isInRoom(room) {
    return room === this.currentRoom;
  },

  startQuiz(questions, rounds) {
    socket.emit("startQuiz", { questions, rounds, lobby: this.currentRoom });
  },

  respondToQuestion(question, response) {
    socket.emit("respondToQuestion", { question, response });
  },
};

export default ioClient;
