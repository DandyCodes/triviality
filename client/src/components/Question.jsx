import { useEffect, useState } from "react";
import shuffle from "shuffle-array";
import ioClient from "../controllers/io-client";

const Question = ({ hasBeenAnswered }) => {
  const [question, setQuestion] = useState();
  const [responded, setResponded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const askQuestion = event => {
    setResponded(false);
    setTimeRemaining(parseInt(event.detail.timeLimit * 0.001));
    const encoded = event.detail.question;
    const decodedOptions = encoded.correct_answer
      ? shuffle(
          encoded.incorrect_answers
            .map(ans => Buffer.from(ans, "base64").toString())
            .concat([Buffer.from(encoded.correct_answer, "base64").toString()])
        )
      : [];
    const decodedQuestion = encoded.question
      ? Buffer.from(encoded.question, "base64").toString()
      : null;
    setQuestion({
      ...event.detail,
      decodedOptions,
      decodedQuestion,
    });
  };
  const respondToQuestion = decodedResponse => {
    setResponded(true);
    ioClient.respondToQuestion(
      question,
      Buffer.from(decodedResponse).toString("base64")
    );
  };
  useEffect(() => {
    const timeOut = setTimeout(
      () => setTimeRemaining(Math.max(timeRemaining - 1, 0)),
      1000
    );
    window.addEventListener("askQuestion", askQuestion);
    return () => {
      clearTimeout(timeOut);
      window.removeEventListener("askQuestion", askQuestion);
    };
  });
  return question ? (
    <article>
      <section>{question.decodedQuestion}</section>
      <section>
        {question.decodedOptions.map((decodedOption, index) =>
          responded || hasBeenAnswered ? (
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
      <section>
        {hasBeenAnswered ? null : <span>Time Remaining: {timeRemaining}</span>}
      </section>
    </article>
  ) : null;
};

export default Question;
