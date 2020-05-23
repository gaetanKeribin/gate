const initialState = {
  conversations: [],
  conversationsIds: [],
  interlocutorsIds: [],
  lastUpdatedAt: null,
  isLoaded: false,
  isFetchingConversations: false,
  isFetchingConversation: false,
};

import _ from "lodash";

const copyAndUpdate = (array, i, update) => {
  let copy = [];

  if (i > 0) copy.concat(array.slice(0, index));
  copy.concat({ ...array[index], ...update });
  copy.concat(index + 1);

  return copy;
};

export default function (state = initialState, action) {
  let i = _.findIndex(state.conversations, {
    _id: action.payload?.conversation_id,
  });

  switch (action.type) {
    case "REQUEST_CONVERSATIONS:SUCCESS":
      return {
        ...state,
        lastUpdatedAt: action.receivedAt,
        conversations: action.payload.conversations,
        isLoaded: true,
      };
    case "REQUEST_CONVERSATION:SUCCESS":
      return {
        ...state,
        conversations: copyAndUpdate(
          state.conversations,
          i,
          action.payload.conversation
        ),
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
      };
    case "RECEIVE_READ_ACK":
      return {
        ...state,
        lastUpdatedAt: action.receivedAt,
        conversations: copyAndUpdate(state.conversations, i, {
          readAck: action.payload.reacAck,
        }),
        isLoaded: true,
      };
    case "RECEIVE_WRITING_ACK":
      return {
        ...state,
        lastUpdatedAt: action.receivedAt,
        conversations: copyAndUpdate(state.conversations, i, {
          writing: action.payload.writing,
        }),
      };
    case "RECEIVE_NEW_CONVERSATION":
      return {
        ...state,
        conversations: [action.payload.conversation, ...state.conversations],
        lastUpdatedAt: action.receivedAt,
      };
    case "RECEIVE_NEW_MESSAGE":
      return {
        ...state,
        lastUpdatedAt: action.receivedAt,
        conversations: copyAndUpdate(state.conversations, i, {
          lastMessage: action.message,
          messages: Array.isArray(state.conversations[i].messages)
            ? [action.message, ...state.conversations[i].messages]
            : [action.message],
        }),
      };
    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    default:
      return state;
  }
}
