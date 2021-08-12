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
    getRoomMembers(room: String!): [String]
    isRoomCreator(room: String!): Boolean
  }

  type Mutation {
    addUser(nickname: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    deleteUser: User
  }
`;

module.exports = typeDefs;
