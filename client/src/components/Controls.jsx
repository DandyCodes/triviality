import { useState } from "react";
import ioClient from "../controllers/io-client";

const Controls = () => {
  const [formState, setFormState] = useState({
    questions: 5,
    rounds: 2,
    timeLimit: 15,
    roundBreak: 15,
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
    ioClient.startQuiz(formState);
  };
  return (
    <aside>
      <h2>Controls</h2>
      <label htmlFor="questions">Questions Per Round: </label>
      <input
        placeholder="Questions Per Round"
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
        max="5"
        value={formState.rounds}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="timeLimit">Question Time Limit: </label>
      <input
        placeholder="Question Time Limit"
        type="number"
        id="timeLimit"
        name="timeLimit"
        min="10"
        max="45"
        value={formState.timeLimit}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="roundBreak">Round Break Time: </label>
      <input
        placeholder="Round Break Time"
        type="number"
        id="roundBreak"
        name="roundBreak"
        min="1"
        max="600"
        value={formState.roundBreak}
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
