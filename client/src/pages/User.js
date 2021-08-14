import React, { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER, GET_ME } from "../utils/queries";
import { UPDATE_NICKNAME, DELETE_USER } from "../utils/mutations";
import clientAuth from "../utils/client-auth";
import "./styles/User.css";

const User = () => {
  const { userId } = useParams();
  const [formState, setFormState] = useState({
    nickname: "",
  });
  const [updateNickname, { error: updateError }] = useMutation(UPDATE_NICKNAME);
  const [deleteUser, { error: deleteError }] = useMutation(DELETE_USER);
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
  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const onClickUpdateNickname = async () => {
    try {
      await updateNickname({
        variables: { ...formState },
      });
    } catch (err) {
      console.error(err);
    }
    setFormState({
      nickname: "",
    });
  };
  const onClickDeleteProfile = async () => {
    if (
      window.confirm("Are you sure you wish to delete your entire profile?")
    ) {
      try {
        await deleteUser();
        clientAuth.onLogout();
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <main>
      {loading ? (
        <div>Loading...</div>
      ) : !user?.nickname ? (
        <Redirect to="/" />
      ) : (
        <section>
          <div className="heading">
            {userId ? `${user.nickname}` : `${user.nickname} (you)`}
          </div>
          <div className="minor-heading">
            Multiplayer games won: {user.won ? user.won : 0}
          </div>
          <div className="minor-heading">
            Total games played: {user.played ? user.played : 0}
          </div>
          {userId ? null : (
            <section>
              <input
                name="nickname"
                id="nickname"
                onChange={handleChange}
                type="text"
                placeholder="Change nickname?"
                value={formState.nickname}
                onKeyDown={e => e.key === "Enter" && onClickUpdateNickname()}
              ></input>
              <button
                onClick={onClickUpdateNickname}
                id="edit"
                className="heading-button"
              >
                UPDATE
              </button>
              {updateError && <span>{updateError.message}</span>}
            </section>
          )}
          <br></br>
          {userId ? null : (
            <section>
              <button
                onClick={onClickDeleteProfile}
                id="delete"
                className="heading-button"
              >
                DELETE
              </button>
              {deleteError && <span>{deleteError.message}</span>}
            </section>
          )}
        </section>
      )}
    </main>
  );
};

export default User;
