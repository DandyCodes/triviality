import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import clientAuth from "../utils/client-auth";
import { CONFIRM_ROOM } from "../utils/queries";

const Room = props => {
  const { roomId } = useParams();
  const { loading, data } = useQuery(CONFIRM_ROOM, {
    variables: { roomId },
  });
  return !clientAuth.isLoggedIn ? (
    <Redirect to="/login" />
  ) : loading ? (
    <div>Loading...</div>
  ) : data && data.confirmRoom ? (
    <main>
      <h1>Room ID: {roomId}</h1>
    </main>
  ) : (
    <Redirect to="/" />
  );
};

export default Room;
