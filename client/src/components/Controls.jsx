import { useState } from "react";
import ioClient from "../controllers/io-client";

const Controls = () => {
  const [formState, setFormState] = useState({
    questions: 5,
    rounds: 2,
    clickedStart: false,
  });
  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const startQuiz = async () => {
    setFormState({ ...formState, clickedStart: true });
    ioClient.startQuiz(formState.questions, formState.rounds);
  };
  return (
    <aside>
      <h2>Room Controls</h2>
      <label htmlFor="questions">Questions: </label>
      <input
        placeholder="Questions"
        type="number"
        id="questions"
        name="questions"
        min="1"
        max="40"
        value={formState.questions}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="rounds">Rounds: </label>
      <input
        placeholder="Rounds"
        type="number"
        id="rounds"
        name="rounds"
        min="1"
        max="10"
        value={formState.rounds}
        onChange={handleChange}
      />
      <br />
      {formState.clickedStart ? (
        <button disabled>Starting...</button>
      ) : (
        <button onClick={startQuiz}>StartQuiz</button>
      )}
    </aside>
  );
};

export default Controls;
