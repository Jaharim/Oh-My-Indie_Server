const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supportSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  indieId: {
    type: mongoose.Types.ObjectId,
    ref: "Indie",
    required: true,
  },
});

module.exports = mongoose.model("Support", supportSchema);
