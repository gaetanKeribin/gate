import _ from "lodash";
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
      console.log(action.data);

      state.conversations.splice(
        state.conversations
          .map(function (c) {
            return c._id;
          })
          .indexOf(action.data._id),
        1,
        action.data
      );
      return {
        ...state,
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
    case "RECEIVE_MESSAGE":
      let i = state.conversations
        .map(function (c) {
          return c._id;
        })
        .indexOf(action.message.conversation_id);
      state.conversations[i].lastMessage = action.message;
      state.conversations[i].messages.splice(0, 0, action.message);
      console.log(state);

      return state;
    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    default:
      return state;
  }
}
