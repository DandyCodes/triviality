import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER, GET_ME } from "../utils/queries";
import clientAuth from "../utils/client-auth";

const User = () => {
  const { userId } = useParams();
  const { loading, data } = useQuery(userId ? GET_USER : GET_ME, {
    variables: { userId },
  });
  const user = data?.me || data?.user || {};
  if (
    clientAuth.isLoggedIn() &&
    clientAuth.getDecodedToken().data._id === userId
  ) {
    return <Redirect to="/me" />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user?.nickname) {
    return <h1>You need to log in</h1>;
  }
  return <h2>{userId ? `${user.nickname}` : "You"}</h2>;
};

export default User;
