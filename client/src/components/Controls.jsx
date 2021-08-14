import { Fragment, useState } from "react";
import ioClient from "../controllers/io-client";
import "./styles/Controls.css";

const Controls = ({ multiplayer }) => {
  const [formState, setFormState] = useState({
    questions: 7,
    rounds: 3,
    timeLimit: 20,
    roundBreak: 10,
    gameMode: "",
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
    <section>
      {multiplayer ? (
        <Fragment>
          <label htmlFor="gameMode" className="minor-heading">
            Game Mode:
          </label>
          <select
            className="game-mode-select"
            placeholder="Game Mode"
            id="gameMode"
            name="gameMode"
            value={formState.gameMode}
            onChange={handleChange}
          >
            <option value="everyone">Everyone Can Answer</option>
            <option value="fastest">Fastest Finger First</option>
          </select>
          {formState.gameMode === "fastest" ? (
            <div>Points are awarded for the fastest correct answer only</div>
          ) : formState.gameMode === "everyone" ? (
            <div>
              Points are rewarded for every correct answer, not just the fastest
            </div>
          ) : null}
          <br />
        </Fragment>
      ) : null}
      <label htmlFor="questions" className="minor-heading">
        Questions Per Round:
      </label>
      <input
        className="number"
        placeholder="Questions Per Round"
        type="number"
        id="questions"
        name="questions"
        min="1"
        max="100"
        value={formState.questions}
        onChange={handleChange}
      />
      <label htmlFor="rounds" className="minor-heading">
        Number Of Rounds:
      </label>
      <input
        className="number"
        placeholder="Rounds"
        type="number"
        id="rounds"
        name="rounds"
        min="1"
        max="10"
        value={formState.rounds}
        onChange={handleChange}
      />
      <label htmlFor="timeLimit" className="minor-heading">
        Question Time Limit:
      </label>
      <input
        className="number"
        placeholder="Question Time Limit"
        type="number"
        id="timeLimit"
        name="timeLimit"
        min="15"
        max="60"
        value={formState.timeLimit}
        onChange={handleChange}
      />
      <label htmlFor="roundBreak" className="minor-heading">
        Round Break Time:
      </label>
      <input
        className="number"
        placeholder="Round Break Time"
        type="number"
        id="roundBreak"
        name="roundBreak"
        min="1"
        max="1000"
        value={formState.roundBreak}
        onChange={handleChange}
      />
      <br />
      {formState.clickedStart ? (
        <button className="heading-button" disabled>
          Starting...
        </button>
      ) : (
        <button className="heading-button" onClick={startQuiz}>
          Start
        </button>
      )}
    </section>
  );
};

export default Controls;
