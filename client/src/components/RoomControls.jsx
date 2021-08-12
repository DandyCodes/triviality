import { useQuery } from "@apollo/client";
import { useState } from "react";
import { IS_ROOM_CREATOR } from "../utils/queries";

const RoomControls = ({ room }) => {
  const { loading, data } = useQuery(IS_ROOM_CREATOR, {
    variables: { room },
  });
  const [quizConfig, setQuizConfig] = useState({
    questions: 5,
    rounds: 2,
    room,
  });
  const handleChange = event => {
    const { name, value } = event.target;
    setQuizConfig({
      ...quizConfig,
      [name]: value,
    });
  };
  const handleFormSubmit = async event => {
    event.preventDefault();
    // start quiz
  };
  return (
    <aside>
      <h2>Room Controls</h2>
      {loading ? (
        <div>Loading...</div>
      ) : data.isRoomCreator ? (
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="questions">Questions: </label>
          <input
            placeholder="Questions"
            type="number"
            id="questions"
            name="questions"
            min="1"
            max="40"
            value={quizConfig.questions}
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
            value={quizConfig.rounds}
            onChange={handleChange}
          />
          <br />
          <input type="submit" />
        </form>
      ) : (
        <h4>You are not the room creator</h4>
      )}
    </aside>
  );
};

export default RoomControls;
