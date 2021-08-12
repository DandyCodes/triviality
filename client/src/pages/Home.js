import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";

const Home = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    room: "",
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
    return ioClient.joinRoom(formState.room);
  };
  const joinRoom = event => {
    const room = event.detail.room;
    history.push(`/room/${room}`);
  };
  useEffect(() => {
    window.addEventListener("roomJoined", joinRoom);
    return () => {
      window.removeEventListener("roomJoined", joinRoom);
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
              name="room"
              type="text"
              placeholder="Enter Room"
            ></input>
            <br></br>
            <input type="submit"></input>
          </form>
          <button onClick={ioClient.createRoom}>Create Quiz.</button>
        </Fragment>
      ) : (
        <h1>Log in to create or join a quiz</h1>
      )}
    </main>
  );
};

export default Home;
