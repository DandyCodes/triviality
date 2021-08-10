import { useLazyQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import { ASK_FOR_UNIQUE_ROOM_ID } from "../utils/queries";

const Home = () => {
  const [askForUniqueRoomId, { data }] = useLazyQuery(ASK_FOR_UNIQUE_ROOM_ID);
  return (
    <main>
      <div>Welcome</div>
      <Link to={`/users/`}>View users.</Link>
      {data ? (
        window.location.assign(`/room/${data.askForUniqueRoomId}`)
      ) : clientAuth.isLoggedIn() ? (
        <button onClick={askForUniqueRoomId}>Create Quiz.</button>
      ) : (
        <h1>Log in to create or join a quiz</h1>
      )}
    </main>
  );
};

export default Home;
