import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import Members from "../components/Members";
import Question from "../components/Question";
import Finish from "../components/Finish";

const Quiz = () => {
  const { room } = useParams();
  const [quizState, setQuizState] = useState({
    participants: [],
    questions: "",
    rounds: "",
  });
  const [finished, setFinished] = useState(false);
  const updateQuiz = event => {
    setQuizState(event.detail);
  };
  const completeQuiz = event => {
    const finalQuizState = event.detail;
    setQuizState(finalQuizState);
    setFinished(true);
  };
  useEffect(() => {
    window.addEventListener("updateQuiz", updateQuiz);
    window.addEventListener("quizCompleted", completeQuiz);
    return () => {
      window.removeEventListener("updateQuiz", updateQuiz);
      window.removeEventListener("quizCompleted", completeQuiz);
    };
  });
  return !clientAuth.isLoggedIn() || !ioClient.isInRoom(room) ? (
    <Redirect to="/" />
  ) : finished ? (
    <Finish quizState={quizState}></Finish>
  ) : (
    <main>
      <h1>Quiz</h1>
      <Question></Question>
      <Members members={quizState.participants}></Members>
      <h3>Questions Remaining: {quizState.questions}</h3>
      <h3>Rounds Remaining: {quizState.rounds}</h3>
    </main>
  );
};

export default Quiz;
