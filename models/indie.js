const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const indieSchema = new Schema({
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  supports: [
    {
      type: Object,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Indie", indieSchema);
