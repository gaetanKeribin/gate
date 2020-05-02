const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  lastMessageSentAt: {
    type: Date
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }
});

conversationSchema.methods.toJSON = function() {
  const conversation = this;
  const conversationObject = conversation.toObject();

  return conversationObject;
};

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
