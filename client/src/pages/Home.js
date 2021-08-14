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
          <Fragment>
            <section>
              <input
                onChange={handleChange}
                name="lobby"
                type="text"
                placeholder="Enter lobby code..."
                onKeyDown={e => e.key === "Enter" && onJoinLobbyClicked()}
              ></input>
              <button
                className="heading-button"
                onClick={onJoinLobbyClicked}
                type="submit"
              >
                JOIN
              </button>
            </section>
            <section>
              <div className="subheading">OR</div>
            </section>
            <section>
              <button className="heading-button" onClick={ioClient.createLobby}>
                CREATE
              </button>
            </section>
          </Fragment>
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
        <Link to={`/users/`}>
          <div className="minor-heading">View users.</div>
        </Link>
      </article>
    </main>
  );
};

export default Home;
