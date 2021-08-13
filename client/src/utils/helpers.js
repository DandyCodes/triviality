import shuffle from "shuffle-array";

export const decodeQuestion = questionObject => {
  const decodedOptions = questionObject.correct_answer
    ? shuffle(
        questionObject.incorrect_answers
          .map(ans => Buffer.from(ans, "base64").toString())
          .concat([decodeFromBase64(questionObject.correct_answer)])
      )
    : [];
  const decodedQuestion = questionObject.question
    ? decodeFromBase64(questionObject.question)
    : null;
  return { decodedOptions, decodedQuestion };
};

export const decodeFromBase64 = string =>
  Buffer.from(string, "base64").toString();

export const encodeToBase64 = string => Buffer.from(string).toString("base64");

export const delay = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));
