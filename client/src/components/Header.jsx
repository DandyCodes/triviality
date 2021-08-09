import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import "./styles/Header.css";

const Header = () => {
  const logout = () => {
    clientAuth.onLogout();
  };
  return (
    <header>
      <Link to="/">
        <h1>Triviality</h1>
      </Link>
      <nav>
        {clientAuth.isLoggedIn() ? (
          <Fragment>
            <Link to="/me">
              <h2>View Me</h2>
            </Link>
            <button onClick={logout}>Logout</button>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/login">
              <h2>Login</h2>
            </Link>
            <Link to="/signup">
              <h2>Signup</h2>
            </Link>
          </Fragment>
        )}
      </nav>
    </header>
  );
};

export default Header;
