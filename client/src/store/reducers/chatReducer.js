const initialState = {
  conversations: [],
  conversationsIds: [],
  interlocutorsIds: [],
  lastUpdatedAt: null,
  isLoaded: false,
  isFetchingConversations: false,
  isFetchingConversation: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "REQUEST_CONVERSATIONS:SUCCESS":
      return {
        ...state,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
        isFetchingConversations: false,
        ...action.data,
      };
    case "REQUEST_CONVERSATION:SUCCESS":
      return {
        ...state,
        conversations: [
          action.data,
          ...state.conversations.filter((c) => c._id !== action.data._id),
        ],
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
      };
    case "PRIVATE_CONVERSATION_ACK":
    case "RECEIVE_NEW_CONVERSATION":
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        lastUpdatedAt: action.receivedAt,
      };
    case "PRIVATE_MESSAGE_ACK":
    case "RECEIVE_PRIVATE_MESSAGE":
      let i = state.conversations
        .map(function (c) {
          return c._id;
        })
        .indexOf(action.message.conversation_id);

      if (state.conversations[i].messages) {
        return {
          ...state,
          lastUpdatedAt: action.receivedAt,
          conversations: [
            {
              ...state.conversations[i],
              lastMessage: action.message,
              messages: [action.message, ...state.conversations[i].messages],
            },
            ...state.conversations.filter(
              (conv) => conv._id !== action.message.conversation_id
            ),
          ],
          isLoaded: true,
        };
      } else {
        return {
          ...state,
          lastUpdatedAt: action.receivedAt,
          conversations: [
            {
              ...state.conversations[i],
              lastMessage: action.message,
              messages: [action.message],
            },
            ...state.conversations.filter(
              (conv) => conv._id !== action.message.conversation_id
            ),
          ],
          isLoaded: true,
        };
      }

    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    default:
      return state;
  }
}
