import React, { useEffect, useState } from "react";
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
  const onJoinLobbyClicked = () => {
    return ioClient.joinLobby(formState.lobby.toUpperCase());
  };
  const onLobbyJoined = event => {
    history.push(`/lobby/${event.detail.lobby}`);
  };
  useEffect(() => {
    window.addEventListener("lobbyJoined", onLobbyJoined);
    return () => {
      window.removeEventListener("lobbyJoined", onLobbyJoined);
    };
  });
  return (
    <main>
      <article>
        <section>
          <div className="heading">WELCOME</div>
        </section>
        {clientAuth.isLoggedIn() ? (
          <section>
            <input
              onChange={handleChange}
              name="lobby"
              type="text"
              placeholder="Enter lobby code"
              onKeyDown={e => e.key === "Enter" && onJoinLobbyClicked()}
              id="lobby-input"
            ></input>
            <button
              className="heading-button"
              onClick={onJoinLobbyClicked}
              type="submit"
            >
              JOIN
            </button>
            <div className="subheading">OR</div>
            <button className="heading-button" onClick={ioClient.createLobby}>
              CREATE
            </button>
          </section>
        ) : (
          <section>
            <Link className="link-button" to="/login">
              <button className="heading-button">LOGIN</button>
            </Link>
            <div className="subheading">OR</div>
            <Link className="link-button" to="/signup">
              <button className="heading-button">SIGNUP</button>
            </Link>
          </section>
        )}
      </article>
      <article>
        <section>
          <Link className="link" to={`/users/`}>
            <div className="minor-heading">View users.</div>
          </Link>
        </section>
      </article>
    </main>
  );
};

export default Home;
