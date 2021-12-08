const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reply: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
