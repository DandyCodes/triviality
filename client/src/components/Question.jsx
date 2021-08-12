import { useEffect, useState } from "react";
import shuffle from "shuffle-array";
import ioClient from "../controllers/io-client";

const Question = () => {
  const [question, setQuestion] = useState();
  const [responded, setResponded] = useState(false);
  const askQuestion = event => {
    const encoded = event.detail;
    const decodedOptions = shuffle(
      encoded.incorrect_answers
        .map(ans => Buffer.from(ans, "base64").toString())
        .concat([Buffer.from(encoded.correct_answer, "base64").toString()])
    );
    const decodedQuestion = Buffer.from(encoded.question, "base64").toString();
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
    window.addEventListener("askQuestion", askQuestion);
    return () => {
      window.removeEventListener("askQuestion", askQuestion);
    };
  });
  return question ? (
    <article>
      <section>{question.decodedQuestion}</section>
      <section>
        {question.decodedOptions.map((decodedOption, index) =>
          responded ? (
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
    </article>
  ) : null;
};

export default Question;
