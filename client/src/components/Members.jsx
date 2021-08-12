const Members = ({ members }) => {
  return (
    <aside>
      <h2>Members</h2>
      {members.map((member, index) => (
        <div key={index}>
          <h5>
            {member.score} {member.nickname}
          </h5>
        </div>
      ))}
    </aside>
  );
};

export default Members;
