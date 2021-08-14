import { Fragment } from "react";
import "./styles/Members.css";

const Members = ({ members }) => {
  return (
    <div>
      {members.map((member, index) => (
        <div
          key={index}
          className={
            member.isWinner
              ? "subheading member winner"
              : member.hasResponded
              ? member.correct
                ? "subheading correct member"
                : "subheading incorrect member"
              : "subheading member"
          }
        >
          <span>{member.nickname}</span>
          {member.score !== undefined ? (
            <Fragment>
              <span> : </span> <span>{member.score}</span>
            </Fragment>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Members;
