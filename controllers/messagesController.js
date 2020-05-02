const Message = require("../models/message");
const Conversation = require("../models/conversation");

exports.saveMessageInDb = async data => {
  if (data.conversation_id) {
    try {
      console.log("Trying to save message to existing conv");
      const conversation = await Conversation.findById(data.conversation_id);
      const message = new Message(data.message);
      if (conversation.messages.length === 100) {
        conversation.messages.shift();
      }
      conversation.messages.push(message._id);
      conversation.lastMessage = message;
      conversation.lastMessageSentAt = message.sentAt;
      await conversation.save();
      await message.save();
      console.log("Message saved to existing conv");
      return { conversation, message };
    } catch (error) {
      console.log(error);
    }
  } else if (data.recipients) {
    try {
      console.log("Trying to create a new conv");
      const message = new Message(data.message);
      const conversation = new Conversation({
        participants: [data.message.sender, ...data.recipients], // [_id1, _id2, _id3...]
        title: data.conv_title || null,
        messages: [message],
        lastMessage: message,
        lastMessageSentAt: message.sentAt
      });
      await conversation.save();
      await message.save();
      await conversation.populate("participants").execPopulate();
      console.log("Message saved to newly created conv", conversation);
      return { conversation, message, newConv: true };
    } catch (error) {
      console.log(error);
    }
  }
};
