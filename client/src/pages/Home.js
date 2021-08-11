import { useLazyQuery } from "@apollo/client";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import { ASK_FOR_UNIQUE_ROOM_ID } from "../utils/queries";

const Home = () => {
  const history = useHistory();
  const [askForUniqueRoomId, { data }] = useLazyQuery(ASK_FOR_UNIQUE_ROOM_ID);
  function go() {
    history.push(`/room/${data.askForUniqueRoomId}`);
  }
  return (
    <main>
      <div>Welcome</div>
      <Link to={`/users/`}>View users.</Link>
      {data ? (
        setTimeout(go)
      ) : clientAuth.isLoggedIn() ? (
        <button onClick={() => askForUniqueRoomId()}>Create Quiz.</button>
      ) : (
        <h1>Log in to create or join a quiz</h1>
      )}
    </main>
  );
};

export default Home;
