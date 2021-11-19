const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const indieSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  song: {
    type: String,
    required: true,
  },
  birth: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  soundcloud: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    required: true,
  },
  youtube: {
    type: String,
    required: true,
  },
  like: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  supports: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Support",
    },
  ],
});

module.exports = mongoose.model("Indie", indieSchema);
