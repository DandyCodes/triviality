import Members from "./Members";

const Scoreboard = ({ quizState }) => {
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
    <article>
      <section>
        <div className="heading">SCORES</div>
      </section>
      <section>
        <Members members={participants}></Members>
      </section>
    </article>
  );
};

export default Scoreboard;
