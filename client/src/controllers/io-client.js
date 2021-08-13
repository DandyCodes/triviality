import clientAuth from "../utils/client-auth";
import socketClient from "socket.io-client";
import { delay } from "../utils/helpers";
const socket = socketClient();

socket.on("askNickname", async () => {
  const decoded = await clientAuth.getDecodedToken();
  socket.emit("nicknameProvided", decoded?.data?.nickname);
});

async function sendUpdateLobbyEvent(lobbyState) {
  const decodedToken = await clientAuth.getDecodedToken();
  const updateLobbyEvent = new CustomEvent("updateLobby", {
    detail: {
      ...lobbyState,
      isCreator: lobbyState.creator === decodedToken?.data?.nickname,
    },
  });
  window.dispatchEvent(updateLobbyEvent);
}

socket.on("lobbyJoined", async lobbyState => {
  ioClient.currentRoom = lobbyState.lobby;
  const lobbyJoinedEvent = new CustomEvent("lobbyJoined", {
    detail: lobbyState,
  });
  window.dispatchEvent(lobbyJoinedEvent);
  await delay(250);
  await sendUpdateLobbyEvent(lobbyState);
});

socket.on("updateLobby", async lobbyState => {
  await sendUpdateLobbyEvent(lobbyState);
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

socket.on("askQuestion", ({ quizState, question, timeLimit, timeStamp }) => {
  const askQuestionEvent = new CustomEvent("askQuestion", {
    detail: { question, timeLimit, timeStamp },
  });
  window.dispatchEvent(askQuestionEvent);
  const updateQuizEvent = new CustomEvent("updateQuiz", {
    detail: quizState,
  });
  window.dispatchEvent(updateQuizEvent);
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
