import { GET_ROOM_MEMBERS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

const RoomMembers = ({ room }) => {
  const { loading, data, refetch } = useQuery(GET_ROOM_MEMBERS, {
    variables: { room },
  });
  useEffect(() => {
    window.addEventListener("updateRoom", refetch);
    return () => {
      window.removeEventListener("updateRoom", refetch);
    };
  });
  return (
    <aside>
      <h2>Members</h2>
      {loading ? (
        <div>Loading...</div>
      ) : data ? (
        data.getRoomMembers.map((member, index) => (
          <h5 key={index}>{member}</h5>
        ))
      ) : null}
    </aside>
  );
};

export default RoomMembers;
