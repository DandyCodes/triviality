const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const profanityFilter = require("../utils/profanity-filter");

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 16,
    validate: {
      validator: function (value) {
        return !profanityFilter.isProfane(value);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must be a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  won: {
    type: Number,
    required: true,
  },
  played: {
    type: Number,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
