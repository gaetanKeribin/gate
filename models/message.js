const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    default: "employmentType"
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  }
});

messageSchema.methods.toJSON = function() {
  const message = this;
  const messageObject = message.toObject();

  return messageObject;
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
