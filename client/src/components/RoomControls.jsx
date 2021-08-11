import { IS_ROOM_CREATOR } from "../utils/queries";
import { useQuery } from "@apollo/client";

const RoomControls = ({ roomId }) => {
  const { loading, data } = useQuery(IS_ROOM_CREATOR, {
    variables: { roomId },
  });
  return loading ? (
    <div>Loading...</div>
  ) : (
    <aside>
      <h2>Room Controls</h2>
      {data ? (
        data.isRoomCreator ? (
          <button>Start</button>
        ) : (
          <h4>You are not the room creator</h4>
        )
      ) : null}
    </aside>
  );
};

export default RoomControls;
