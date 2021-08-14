import React, { useState } from "react";
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
  const handleFormSubmit = async () => {
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
      <article>
        {data ? (
          <section>
            <div>Success</div>
            <Link to="/">back to home</Link>
          </section>
        ) : (
          <section>
            <input
              placeholder="Nickname"
              name="nickname"
              type="text"
              value={formState.nickname}
              onChange={handleChange}
              onKeyDown={e => e.key === "Enter" && handleFormSubmit()}
            />
            <input
              placeholder="Email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              onKeyDown={e => e.key === "Enter" && handleFormSubmit()}
            />
            <input
              placeholder="******"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              onKeyDown={e => e.key === "Enter" && handleFormSubmit()}
            />
            <button
              className="heading-button"
              onClick={handleFormSubmit}
              type="submit"
            >
              SIGNUP
            </button>
          </section>
        )}
        <section>{error && <div>{error.message}</div>}</section>
      </article>
    </main>
  );
};

export default Signup;
