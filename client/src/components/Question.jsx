import { useEffect, useState } from "react";
import ioClient from "../controllers/io-client";
import { decodeQuestion, encodeToBase64 } from "../utils/helpers";
import "./styles/Question.css";

const Question = () => {
  const [question, setQuestion] = useState();
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const askQuestion = event => {
    setResponse(null);
    setRevealed(false);
    setResponded(false);
    const questionObject = event.detail;
    const difference = Date.now() - questionObject.timeStamp;
    setTimeRemaining(parseInt((questionObject.timeLimit - difference) * 0.001));
    const { decodedOptions, decodedQuestion } = decodeQuestion(questionObject);
    setQuestion({
      ...questionObject,
      decodedOptions,
      decodedQuestion,
    });
  };
  const respondToQuestion = decodedResponse => {
    setResponse(decodedResponse);
    setResponded(true);
    ioClient.respondToQuestion(question, encodeToBase64(decodedResponse));
  };
  const revealAnswer = event => {
    const questionObject = event.detail;
    setTimeRemaining(0);
    setQuestion({
      ...questionObject,
      decodedOptions: question.decodedOptions,
      decodedQuestion: question.decodedQuestion,
    });
    setRevealed(true);
  };
  useEffect(() => {
    const timeOut = setTimeout(
      () => setTimeRemaining(Math.max(timeRemaining - 1, 0)),
      1000
    );
    window.addEventListener("askQuestion", askQuestion);
    window.addEventListener("revealAnswer", revealAnswer);
    return () => {
      clearTimeout(timeOut);
      window.removeEventListener("askQuestion", askQuestion);
      window.removeEventListener("revealAnswer", revealAnswer);
    };
  });
  return question ? (
    <article>
      <section>{question.decodedQuestion}</section>
      <section>
        {question.decodedOptions.map((decodedOption, index) =>
          revealed ? (
            <button
              key={index}
              disabled
              className={
                encodeToBase64(decodedOption) === question.correct_answer
                  ? "correct"
                  : response === decodedOption
                  ? "incorrect"
                  : ""
              }
            >
              {decodedOption}
            </button>
          ) : responded ? (
            <button key={index} disabled>
              {decodedOption}
            </button>
          ) : (
            <button
              key={index}
              onClick={() => respondToQuestion(decodedOption)}
            >
              {decodedOption}
            </button>
          )
        )}
      </section>
      <section>{<span>Time Remaining: {timeRemaining}</span>}</section>
    </article>
  ) : null;
};

export default Question;
