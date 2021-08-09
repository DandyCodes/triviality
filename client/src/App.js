import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { messageAll } from "./controllers/io-client";
import clientAuth from "./utils/client-auth";
import { ADD_USER, LOGIN_USER } from "./utils/mutations";

const msg = "hi";

function App() {
  const [addUserFormState, setAddUserFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser] = useMutation(ADD_USER);

  const handleAddUserFormChange = event => {
    const { name, value } = event.target;
    setAddUserFormState({
      ...addUserFormState,
      [name]: value,
    });
  };

  const handleAddUserSubmit = async event => {
    event.preventDefault();
    const mutationResponse = await addUser({
      variables: {
        username: addUserFormState.username,
        email: addUserFormState.email,
        password: addUserFormState.password,
      },
    });
    const token = mutationResponse.data.addUser.token;
    clientAuth.onLogin(token);
  };

  const [loginFormState, setLoginFormState] = useState({
    email: "",
    password: "",
  });
  const [login] = useMutation(LOGIN_USER);

  const handleLoginFormChange = event => {
    const { name, value } = event.target;
    setLoginFormState({
      ...loginFormState,
      [name]: value,
    });
  };

  const handleLoginSubmit = async event => {
    event.preventDefault();
    const mutationResponse = await login({
      variables: {
        email: loginFormState.email,
        password: loginFormState.password,
      },
    });
    const token = mutationResponse.data.login.token;
    clientAuth.onLogin(token);
  };

  return (
    <div className="App">
      <button onClick={() => messageAll(msg)}>messageAll</button>
      <h1>ADD USER</h1>
      <form onSubmit={handleAddUserSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          onChange={handleAddUserFormChange}
        ></input>
        <br></br>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          onChange={handleAddUserFormChange}
        ></input>
        <br></br>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleAddUserFormChange}
        ></input>
        <br></br>
        <button>Submit</button>
      </form>
      <h1>LOGIN</h1>
      <form onSubmit={handleLoginSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          onChange={handleLoginFormChange}
        ></input>
        <br></br>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleLoginFormChange}
        ></input>
        <br></br>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
