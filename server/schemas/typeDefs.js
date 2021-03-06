const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    nickname: String
    email: String
    password: String
    won: Int
    played: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]!
    user(userId: ID!): User
    me: User
  }

  type Mutation {
    addUser(nickname: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    deleteUser: User
    updateNickname(nickname: String!): User
  }
`;

module.exports = typeDefs;
