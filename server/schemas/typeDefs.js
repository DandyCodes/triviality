const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    nickname: String
    email: String
    password: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]!
    user(userId: ID!): User
    me: User
    askForUniqueRoomId: String
    getRoomMembers(roomId: String!): [String]
    isRoomCreator(roomId: String!): Boolean
  }

  type Mutation {
    addUser(nickname: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    deleteUser: User
    requestToBeginQuiz(questions: Int!): Boolean
  }
`;

module.exports = typeDefs;
