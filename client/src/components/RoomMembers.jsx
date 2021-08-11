import { GET_ROOM_MEMBERS } from "../utils/queries";
import { useQuery } from "@apollo/client";

const RoomMembers = ({ roomId }) => {
  const { loading, data } = useQuery(GET_ROOM_MEMBERS, {
    variables: { roomId },
    pollInterval: 1500,
  });
  return loading ? (
    <div>Loading...</div>
  ) : (
    <aside>
      <h2>Members</h2>
      {data
        ? Array.from(data.getRoomMembers).map((member, index) => (
            <h5 key={index}>{member}</h5>
          ))
        : null}
    </aside>
  );
};

export default RoomMembers;
