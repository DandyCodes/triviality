import React from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import RoomMembers from "../components/RoomMembers";

const Room = () => {
  const { roomId } = useParams();
  if (!clientAuth.isLoggedIn()) {
    return <Redirect to="/" />;
  }
  ioClient.joinRoom(roomId);
  return (
    <main>
      <h1>Room ID: {roomId}</h1>
      <RoomMembers roomId={roomId}></RoomMembers>
    </main>
  );
};

export default Room;
