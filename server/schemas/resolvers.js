const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/server-auth");
const { User } = require("../models");

const rooms = [];

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

    confirmRoom: async (_, { roomId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      const room = rooms.find(room => room.id === roomId);
      return room.userIds.includes(context.user._id);
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
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      return User.findOneAndDelete({ _id: context.user._id });
    },

    createRoom: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      const roomId = generateRoomId();
      const room = rooms.find(room => room.id === roomId);
      room.userIds = [];
      room.userIds.push(context.user._id);
      return roomId;
    },
  },
};

module.exports = resolvers;

function generateRoomId() {
  let roomId = "";
  const length = 4;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let created = false;
  while (!created) {
    for (let i = 0; i < length; i++) {
      const randomIndex = randomRangeInt(0, characters.length);
      roomId += characters[randomIndex];
    }
    const roomIds = rooms.map(room => room.id);
    if (!roomIds.includes(roomId)) {
      created = true;
    }
  }
  rooms.push({ id: roomId });
  function destroyRoom() {
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    rooms.splice(roomIndex, 1);
  }
  setTimeout(destroyRoom, 10000000);
  return roomId;
}

function randomRangeInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
