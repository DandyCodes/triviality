import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import clientAuth from "../utils/client-auth";
import ioClient from "../controllers/io-client";
import Members from "../components/Members";
import Question from "../components/Question";
import Scoreboard from "../components/Scoreboard";
import "./styles/Quiz.css";

const Quiz = () => {
  const { room } = useParams();
  const [quizState, setQuizState] = useState({
    participants: [],
    questions: "",
    rounds: "",
    gameMode: "",
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
    <main>
      <Scoreboard quizState={quizState}></Scoreboard>
    </main>
  ) : (
    <main>
      <article>
        <Question></Question>
      </article>

      <article>
        <section>
          <div className="minor-heading">PLAYERS</div>
        </section>
        <section>
          <Members members={quizState.participants}></Members>
        </section>
        <section>
          <div>Questions Remaining: {quizState.questions}</div>
          <div>Rounds Remaining: {quizState.rounds}</div>
          {quizState.gameMode ? (
            quizState.gameMode === "fastest" ? (
              <div className="game-mode-display">Fastest Finger First</div>
            ) : quizState.gameMode === "everyone" ? (
              <div className="game-mode-display">Everyone Can Answer</div>
            ) : null
          ) : (
            <div className="game-mode-display">Solo Play</div>
          )}
        </section>
      </article>
    </main>
  );
};

export default Quiz;
