export const sendMessage = (message) => {
  return {
    type: "SOCKET",
    event: "message",
    payload: {
      ...message,
      sentAt: new Date(),
    },
  };
};

export const fetchConversation = (conversation_id) => {
  return {
    type: "REQUEST_CONVERSATION",
    method: "GET",
    route: `conversations/single/${conversation_id}`,
  };
};

export const fetchConversations = () => {
  return {
    type: "REQUEST_CONVERSATIONS",
    method: "GET",
    route: `conversations`,
  };
};

export const deleteConversation = (conversation_id) => {
  return {
    type: "REQUEST_DELETE_CONVERSATION",
    method: "DELETE",
    route: `conversations/${conversation_id}`,
    successNotification: {
      message: "Conversation supprimée",
      variant: "information",
      timeout: 1000,
    },
    errorNotification: {
      message: "Cela n'a pas marché... Essayez de nouveau.",
      variant: "error",
      timeout: 2000,
    },
  };
};
