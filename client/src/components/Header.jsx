import { Link } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import "./styles/Header.css";
import logo from "../assets/img/triviality-logo.png";
import { Fragment } from "react";

const Header = () => {
  const logout = () => {
    clientAuth.onLogout();
  };
  return (
    <header>
      <Link className="link" to="/">
        <img src={logo} alt="triviality logo" />
      </Link>
      <nav>
        {clientAuth.isLoggedIn() ? (
          <Fragment>
            <Link className="link" to="/me">
              Profile
            </Link>
            <span className="link" onClick={logout}>
              Logout
            </span>
          </Fragment>
        ) : (
          <Fragment>
            <Link className="link" to="/login">
              Login
            </Link>
            <Link className="link" to="/signup">
              Signup
            </Link>
          </Fragment>
        )}
      </nav>
    </header>
  );
};

export default Header;
