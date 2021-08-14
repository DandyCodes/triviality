import React from "react";
import { useQuery } from "@apollo/client";
import UserList from "../components/UserList";
import { GET_USERS } from "../utils/queries";

const Users = () => {
  const { loading, data } = useQuery(GET_USERS);
  const users = data?.users || [];
  return (
    <main>{loading ? <div>Loading...</div> : <UserList users={users} />}</main>
  );
};

export default Users;
