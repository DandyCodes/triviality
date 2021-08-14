import React from "react";
import { Link } from "react-router-dom";

const UserList = ({ users }) => {
  if (!users.length) {
    return <h3>No Users Yet</h3>;
  }
  return (
    <article>
      <section>
        <div className="heading">USERS</div>
      </section>
      {users &&
        users.map(user => (
          <section key={user._id}>
            <div className="subheading">{user.nickname}</div>
            <Link to={`/users/${user._id}`}>
              <div className="minor-heading">View User</div>
            </Link>
          </section>
        ))}
    </article>
  );
};

export default UserList;
