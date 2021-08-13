import { Fragment } from "react";
import "./styles/Members.css";

const Members = ({ members }) => {
  return (
    <section>
      {members.map((member, index) => (
        <div key={index}>
          <div
            className={
              member.isWinner
                ? "member winner"
                : member.hasResponded
                ? member.correct
                  ? "correct member"
                  : "incorrect member"
                : "member"
            }
          >
            <span>{member.nickname}</span>
            {member.score !== undefined ? (
              <Fragment>
                <span> : </span> <span>{member.score}</span>
              </Fragment>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Members;
