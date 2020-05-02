const Message = require("../models/message");
const Conversation = require("../models/conversation");

exports.saveMessageInDb = async (data, user) => {
  const message = new Message(data);
  if (data.conversation_id) {
    try {
      console.log("Trying to save message to existing conv");
      const conversation = await Conversation.findById(message.conversation_id);
      if (conversation.messages.length >= 100) {
        conversation.messages.shift();
      }
      conversation.messages.push(message._id);
      conversation.lastMessage = message;
      conversation.lastMessageSentAt = message.sentAt;
      await conversation.save();
      await message.save();
      console.log("Message saved to existing conv");
      return { conversation, savedMessage: message };
    } catch (error) {
      console.log(error);
    }
  } else if (data.recipients) {
    try {
      console.log("Trying to create a new conv");
      const conversation = new Conversation({
        participants: [message.sender, ...message.recipients],
        title: data.conv_title || null,
        messages: [message],
        lastMessage: message._id,
        lastMessageSentAt: message.sentAt,
      });
      await conversation.save();
      message.conversation_id = conversation._id;
      await message.save();
      await conversation.populate("participants").execPopulate();
      await conversation.populate("lastMessage").execPopulate();
      console.log("Message saved to newly created conv");
      return { conversation, savedMessage: message, newConv: true };
    } catch (error) {
      console.log(error);
    }
  }
};
