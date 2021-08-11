import React from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import RoomMembers from "../components/RoomMembers";
import RoomControls from "../components/RoomControls";
import { useQuery } from "@apollo/client";
import { GET_ROOM_MEMBERS } from "../utils/queries";

const Room = () => {
  const { roomId } = useParams();
  const { loading, data } = useQuery(GET_ROOM_MEMBERS, {
    variables: { roomId },
  });
  if (!clientAuth.isLoggedIn()) {
    return <Redirect to="/" />;
  }
  ioClient.joinRoom(roomId);
  return loading ? (
    <div>Loading...</div>
  ) : data ? (
    <main>
      <h1>Room ID: {roomId}</h1>
      <RoomMembers roomId={roomId}></RoomMembers>
      <RoomControls roomId={roomId}></RoomControls>
    </main>
  ) : (
    <Redirect to="/" />
  );
};

export default Room;
