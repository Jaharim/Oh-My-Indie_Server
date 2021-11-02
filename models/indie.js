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
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: Object,
    required: true,
  },
  sns: {
    type: Object,
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
