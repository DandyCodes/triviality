import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import Members from "../components/Members";
import Controls from "../components/Controls";

const Room = () => {
  const { room } = useParams();
  const history = useHistory();
  const [roomState, setRoomState] = useState({
    nicknames: [],
    isCreator: false,
  });
  const joinQuiz = event => {
    const room = event.detail.room;
    history.push(`/quiz/${room}`);
  };
  const updateRoom = event => {
    setRoomState(event.detail);
  };
  useEffect(() => {
    window.addEventListener("quizJoined", joinQuiz);
    window.addEventListener("updateRoom", updateRoom);
    return () => {
      window.removeEventListener("quizJoined", joinQuiz);
      window.removeEventListener("updateRoom", updateRoom);
    };
  });
  return !clientAuth.isLoggedIn() || !ioClient.isInRoom(room) ? (
    <Redirect to="/" />
  ) : (
    <main>
      <h1>Room: {room}</h1>
      <Members
        members={roomState.nicknames.map(nickname => ({ nickname }))}
      ></Members>
      {roomState.isCreator ? (
        <Controls room={room}></Controls>
      ) : (
        <h4>Waiting...</h4>
      )}
    </main>
  );
};

export default Room;
