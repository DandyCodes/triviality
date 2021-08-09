const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/server-auth");
const { User } = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (_, { userId }) => {
      return User.findOne({ _id: userId });
    },

    me: async (_, __, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("Must be logged in");
    },
  },

  Mutation: {
    addUser: async (_, { name, email, password }) => {
      const user = await User.create({ name, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect username or password");
      }
      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw new AuthenticationError("Incorrect username or password");
      }
      const token = signToken(user);
      return { token, user };
    },

    deleteUser: async (_, __, context) => {
      if (context.user) {
        return User.findOneAndDelete({ _id: context.user._id });
      }
      throw new AuthenticationError("Must be logged in");
    },
  },
};

module.exports = resolvers;
