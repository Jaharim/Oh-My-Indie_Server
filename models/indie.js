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
    },
  ],
  supports: [
    {
      type: Object,
    },
  ],
});

module.exports = mongoose.model("Indie", indieSchema);
