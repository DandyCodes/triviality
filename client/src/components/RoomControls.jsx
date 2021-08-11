import { IS_ROOM_CREATOR } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { REQUEST_TO_BEGIN_QUIZ } from "../utils/mutations";

const RoomControls = ({ roomId }) => {
  const { loading, data: queryData } = useQuery(IS_ROOM_CREATOR, {
    variables: { roomId },
  });
  const [quizConfig, setQuizConfig] = useState({
    questions: 5,
    rounds: 2,
  });
  const [requestToBeginQuiz] = useMutation(REQUEST_TO_BEGIN_QUIZ);
  const handleChange = event => {
    const { name, value } = event.target;
    setQuizConfig({
      ...quizConfig,
      [name]: value,
    });
  };
  const handleFormSubmit = async event => {
    event.preventDefault();
    await requestToBeginQuiz({
      variables: {
        questions: parseInt(quizConfig.questions),
        rounds: parseInt(quizConfig.rounds),
      },
    });
  };
  return loading ? (
    <div>Loading...</div>
  ) : (
    <aside>
      <h2>Room Controls</h2>
      {queryData ? (
        queryData.isRoomCreator ? (
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
        )
      ) : null}
    </aside>
  );
};

export default RoomControls;
