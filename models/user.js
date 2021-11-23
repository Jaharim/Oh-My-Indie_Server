const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new!",
  },
  like: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Indie",
    },
  ],
  supports: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Support",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
