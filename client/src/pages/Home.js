import { useLazyQuery } from "@apollo/client";
import React, { Fragment, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import { ASK_FOR_UNIQUE_ROOM_ID } from "../utils/queries";

const Home = () => {
  const history = useHistory();
  const [askForUniqueRoomId, { data }] = useLazyQuery(ASK_FOR_UNIQUE_ROOM_ID);
  const [roomId, setRoomId] = useState("");
  function go() {
    history.push(`/room/${data.askForUniqueRoomId}`);
  }
  const handleChange = event => {
    const { value } = event.target;
    setRoomId(value);
  };
  const handleFormSubmit = event => {
    event.preventDefault();
    return window.location.assign(`/room/${roomId}`);
  };
  return (
    <main>
      <div>Welcome</div>
      <Link to={`/users/`}>View users.</Link>
      {data ? (
        setTimeout(go)
      ) : clientAuth.isLoggedIn() ? (
        <Fragment>
          <form onSubmit={handleFormSubmit}>
            <input
              onChange={handleChange}
              name="roomId"
              type="text"
              placeholder="Enter Room ID"
            ></input>
            <br></br>
            <input type="submit"></input>
          </form>
          <button onClick={askForUniqueRoomId}>Create Quiz.</button>
        </Fragment>
      ) : (
        <h1>Log in to create or join a quiz</h1>
      )}
    </main>
  );
};

export default Home;
