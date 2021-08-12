import { useEffect, useState } from "react";
import shuffle from "shuffle-array";
import he from "he";

const Question = () => {
  const [question, setQuestion] = useState();
  const askQuestion = event => {
    const encoded = event.detail;
    const decodedOptions = encoded.incorrect_answers
      .map(ans => he.decode(ans))
      .concat([he.decode(encoded.correct_answer)]);
    const decodedQuestion = he.decode(encoded.question);
    setQuestion({
      ...event.detail,
      options: shuffle(decodedOptions),
      question: decodedQuestion,
    });
  };
  useEffect(() => {
    window.addEventListener("askQuestion", askQuestion);
    return () => {
      window.removeEventListener("askQuestion", askQuestion);
    };
  });
  return question ? (
    <article>
      <section>{question.question}</section>
      <section>
        {question.options.map((option, index) => (
          <h4 key={index}>{option}</h4>
        ))}
      </section>
    </article>
  ) : null;
};

export default Question;
