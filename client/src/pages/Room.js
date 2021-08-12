import React from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import RoomMembers from "../components/RoomMembers";
import RoomControls from "../components/RoomControls";

const Room = () => {
  const { room } = useParams();
  return !clientAuth.isLoggedIn() || !ioClient.isInRoom(room) ? (
    <Redirect to="/" />
  ) : (
    <main>
      <h1>Room: {room}</h1>
      <RoomMembers room={room}></RoomMembers>
      <RoomControls room={room}></RoomControls>
    </main>
  );
};

export default Room;
