import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../utils/mutations";
import clientAuth from "../utils/client-auth";

const Login = props => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN);
  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = async event => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      clientAuth.onLogin(data.login.token);
    } catch (err) {
      console.error(err);
    }
    setFormState({
      email: "",
      password: "",
    });
  };
  return (
    <main>
      <h4>Login</h4>
      {data ? (
        <Fragment>
          <h1>Success</h1>
          <Link to="/">back to home</Link>
        </Fragment>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
          />
          <input
            placeholder="******"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
          />
          <input type="submit" />
        </form>
      )}
      {error && <div>{error.message}</div>}
    </main>
  );
};

export default Login;
