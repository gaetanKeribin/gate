export const sendPrivateMessage = (message) => {
  return {
    type: "SOCKET",
    event: "private-message",
    payload: {
      ...message,
      sentAt: new Date(),
    },
    dispatchCallback: "SEND_PRIVATE_MESSAGE",
  };
};

export const startPrivateConversation = (message) => {
  return {
    type: "SOCKET",
    event: "private-conversation",
    payload: {
      ...message,
      sentAt: new Date(),
    },
    dispatchCallback: "START_PRIVATE_CONVERSATION",
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
    errorNotification: true,
  };
};
