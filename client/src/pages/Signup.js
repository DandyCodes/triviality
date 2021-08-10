import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import clientAuth from "../utils/client-auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    nickname: "",
    email: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);
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
      const { data } = await addUser({
        variables: { ...formState },
      });
      clientAuth.onLogin(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <h4>Sign Up</h4>
      {data ? (
        <Fragment>
          <h1>Success</h1>
          <Link to="/">back to home</Link>
        </Fragment>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            placeholder="Nickname"
            name="nickname"
            type="text"
            value={formState.nickname}
            onChange={handleChange}
          />
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

export default Signup;
