import React from "react";
import { Link } from "react-router-dom";

const UserList = ({ users, title }) => {
  if (!users.length) {
    return <h3>No Users Yet</h3>;
  }
  return (
    <article>
      <h3>{title}</h3>
      {users &&
        users.map(user => (
          <section key={user._id}>
            <h4>{user.nickname}</h4>
            <Link to={`/users/${user._id}`}>View User</Link>
          </section>
        ))}
    </article>
  );
};

export default UserList;
