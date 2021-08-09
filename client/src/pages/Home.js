import { useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import { CREATE_ROOM } from "../utils/mutations";

const Home = () => {
  const [createRoom] = useMutation(CREATE_ROOM);
  const handleCreateQuiz = async () => {
    try {
      const { data } = await createRoom();
      window.location.assign(`/room/${data.createRoom}`);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <main>
      <div>Welcome</div>
      <Link to={`/users/`}>View users.</Link>
      {clientAuth.isLoggedIn() ? (
        <button onClick={handleCreateQuiz}>Create Quiz.</button>
      ) : (
        <h1>Log in to create or join a quiz</h1>
      )}
    </main>
  );
};

export default Home;
