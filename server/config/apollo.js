const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("../schemas");
const { authMiddleware } = require("../utils/auth");

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

module.exports = apollo;
