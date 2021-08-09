const { User } = require("../models");
const { signToken } = require("../utils/server-auth");

const resolvers = {
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
