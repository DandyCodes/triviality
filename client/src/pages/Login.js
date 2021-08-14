import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../utils/mutations";
import clientAuth from "../utils/client-auth";

const Login = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN);
  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = async () => {
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
      <article>
        {data ? (
          <section>
            <div className="heading">Success</div>
            <Link to="/">
              <div className="minor-heading">back to home</div>
            </Link>
          </section>
        ) : (
          <section>
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
              LOGIN
            </button>
          </section>
        )}
        <section>{error && <div>{error.message}</div>}</section>
      </article>
    </main>
  );
};

export default Login;
