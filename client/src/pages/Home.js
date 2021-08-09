import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main>
      <div>Welcome</div>
      <Link to={`/users/`}>View users.</Link>
    </main>
  );
};

export default Home;
