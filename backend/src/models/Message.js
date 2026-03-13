const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
{
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);