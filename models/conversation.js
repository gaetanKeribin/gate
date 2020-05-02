const mongoose = require("mongoose");
const Message = require("./message");
const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  lastMessageSentAt: {
    type: Date,
  },
});

conversationSchema.methods.toJSON = function () {
  const conversation = this;
  const conversationObject = conversation.toObject();

  return conversationObject;
};

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
