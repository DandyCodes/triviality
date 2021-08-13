import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";

const Home = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    lobby: "",
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    return ioClient.joinLobby(formState.lobby);
  };
  const joinLobby = event => {
    history.push(`/lobby/${event.detail.lobby}`);
  };
  useEffect(() => {
    window.addEventListener("lobbyJoined", joinLobby);
    return () => {
      window.removeEventListener("lobbyJoined", joinLobby);
    };
  });
  return (
    <main>
      <div>Welcome</div>
      <Link to={`/users/`}>View users.</Link>
      {clientAuth.isLoggedIn() ? (
        <Fragment>
          <form onSubmit={handleFormSubmit}>
            <input
              onChange={handleChange}
              name="lobby"
              type="text"
              placeholder="Enter Lobby"
            ></input>
            <br></br>
            <input type="submit"></input>
          </form>
          <button onClick={ioClient.createLobby}>Create Lobby</button>
        </Fragment>
      ) : (
        <h1>Log in to create or join a quiz</h1>
      )}
    </main>
  );
};

export default Home;
