import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query users {
    users {
      _id
      name
    }
  }
`;

export const GET_USER = gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      _id
      name
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      _id
      name
    }
  }
`;

export const CONFIRM_ROOM = gql`
  query confirmRoom($roomId: String!) {
    confirmRoom(roomId: $roomId)
  }
`;
