import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import Members from "../components/Members";
import Controls from "../components/Controls";

const Lobby = () => {
  const { room } = useParams();
  const history = useHistory();
  const [lobbyState, setLobbyState] = useState({
    nicknames: [],
    isCreator: false,
    lobby: room,
  });
  const joinQuiz = event => {
    const room = event.detail.room;
    history.push(`/quiz/${room}`);
  };
  const updateLobby = event => {
    setLobbyState(event.detail);
  };
  useEffect(() => {
    window.addEventListener("quizJoined", joinQuiz);
    window.addEventListener("updateLobby", updateLobby);
    return () => {
      window.removeEventListener("quizJoined", joinQuiz);
      window.removeEventListener("updateLobby", updateLobby);
    };
  });
  return !clientAuth.isLoggedIn() || !ioClient.isInRoom(room) ? (
    <Redirect to="/" />
  ) : (
    <main>
      <h1>Lobby: {room}</h1>
      <Members
        members={lobbyState.nicknames.map(nickname => ({ nickname }))}
      ></Members>
      {lobbyState.isCreator ? (
        <Controls room={room}></Controls>
      ) : (
        <h4>Waiting...</h4>
      )}
    </main>
  );
};

export default Lobby;
