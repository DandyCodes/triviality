const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/server-auth");
const { User } = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      let users = await User.find();
      users = users.sort((a, b) => b.won - a.won);
      return users;
    },

    user: async (_, { userId }) => {
      return await User.findOne({ _id: userId });
    },

    me: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      return await User.findOne({ _id: context.user._id });
    },
  },

  Mutation: {
    addUser: async (_, { nickname, email, password }) => {
      const user = await User.create({
        nickname,
        email,
        password,
        played: 0,
        won: 0,
      });
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

    updateNickname: async (_, { nickname }, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      const user = await User.findOne({ _id: context.user._id });
      user.nickname = nickname;
      await user.save();
      const updatedUser = await User.findOne({ nickname });
      return updatedUser;
    },

    deleteUser: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      return User.findOneAndDelete({ _id: context.user._id });
    },
  },
};

module.exports = resolvers;
