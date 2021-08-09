import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { messageAll } from "./controllers/io-client";
import clientAuth from "./utils/client-auth";
import { ADD_USER } from "./utils/mutations";

const msg = "hi";

function App() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser] = useMutation(ADD_USER);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    const mutationResponse = await addUser({
      variables: {
        username: formState.username,
        email: formState.email,
        password: formState.password,
      },
    });
    const token = mutationResponse.data.addUser.token;
    clientAuth.onLogin(token);
  };

  return (
    <div className="App">
      <button onClick={() => messageAll(msg)}>messageAll</button>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
        ></input>
        <br></br>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
