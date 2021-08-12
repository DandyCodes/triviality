import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query users {
    users {
      _id
      nickname
    }
  }
`;

export const GET_USER = gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      _id
      nickname
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      _id
      nickname
    }
  }
`;

export const GET_ROOM_MEMBERS = gql`
  query getRoomMembers($room: String!) {
    getRoomMembers(room: $room)
  }
`;

export const IS_ROOM_CREATOR = gql`
  query isRoomCreator($room: String!) {
    isRoomCreator(room: $room)
  }
`;
