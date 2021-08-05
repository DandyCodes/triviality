const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Example {
    _id: ID!
    name: String!
  }

  type Query {
    examples: [Example]
    example(_id: ID!): Example
  }

  type Mutation {
    addExample(name: String!): Example
  }
`;

module.exports = typeDefs;
