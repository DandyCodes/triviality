import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import Members from "../components/Members";
import Question from "../components/Question";

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
      <Question hasBeenAnswered={quizState.questionHasBeenAnswered}></Question>
      <Members members={quizState.participants}></Members>
      <h3>Questions: {quizState.questions}</h3>
      <h3>Rounds: {quizState.rounds}</h3>
    </main>
  );
};

export default Quiz;
