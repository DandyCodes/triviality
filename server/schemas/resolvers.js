const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/server-auth");
const { User } = require("../models");
const ioServer = require("../controllers/io-server");

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (_, { userId }) => {
      return User.findOne({ _id: userId });
    },

    me: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      return User.findOne({ _id: context.user._id });
    },

    getRoomMembers: async (_, { roomId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      return ioServer.getUsersInRoom(roomId);
    },

    askForUniqueRoomId: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      const uniqueRoomId = ioServer.generateUniqueRoomId(4);
      // get the creator to join the room immediately
      const socket = ioServer.getSocketFromNickName(context.user.nickname);
      await socket.join(uniqueRoomId);
      return uniqueRoomId;
    },
  },

  Mutation: {
    addUser: async (_, { nickname, email, password }) => {
      const user = await User.create({ nickname, email, password });
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
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      return User.findOneAndDelete({ _id: context.user._id });
    },
  },
};

module.exports = resolvers;
