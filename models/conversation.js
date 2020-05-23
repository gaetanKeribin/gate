const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startedAt: { type: Date, required: true, default: Date.now },
  messages: [
    {
      text: { type: String, required: true, trim: true },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      sentAt: { type: Date, required: true },
      readAt: { type: Date },
    },
  ],
  readAck: { message_id: String },
  lastMessageSentAt: { type: Date },
});

conversationSchema.methods.toJSON = function () {
  const conversation = this;
  const conversationObject = conversation.toObject();

  return conversationObject;
};

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
