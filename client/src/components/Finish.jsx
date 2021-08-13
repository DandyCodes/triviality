import Members from "./Members";

const Finish = ({ quizState }) => {
  const participants = quizState.participants;
  participants.sort((a, b) => b.score - a.score);
  const scores = participants.map(participant => participant.score);
  const highestScore = Math.max(...scores);
  for (const participant of participants) {
    if (participant.score === highestScore) {
      participant.isWinner = true;
    }
  }
  return (
    <main>
      <Members members={participants}></Members>
    </main>
  );
};

export default Finish;
