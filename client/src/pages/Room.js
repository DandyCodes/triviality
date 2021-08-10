import React from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClientController from "../controllers/io-client";
import RoomMembers from "../components/RoomMembers";

const Room = () => {
  const { roomId } = useParams();
  if (!clientAuth.isLoggedIn()) {
    return <Redirect to="/" />;
  }
  ioClientController.joinIoRoom(roomId);
  return (
    <main>
      <h1>Room ID: {roomId}</h1>
      <RoomMembers roomId={roomId}></RoomMembers>
    </main>
  );
};

export default Room;
