import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import Members from "../components/Members";

const Quiz = () => {
  const { room } = useParams();
  const [quizState, setQuizState] = useState({
    participants: [],
    questions: "",
    rounds: "",
  });
  const updateQuiz = event => {
    setQuizState(event.detail);
  };
  useEffect(() => {
    window.addEventListener("updateQuiz", updateQuiz);
    return () => {
      window.removeEventListener("updateQuiz", updateQuiz);
    };
  });
  return !clientAuth.isLoggedIn() || !ioClient.isInRoom(room) ? (
    <Redirect to="/" />
  ) : (
    <main>
      <h1>Quiz</h1>
      <h3>Questions: {quizState.questions}</h3>
      <h3>Rounds: {quizState.rounds}</h3>
      <Members members={quizState.participants}></Members>
    </main>
  );
};

export default Quiz;
