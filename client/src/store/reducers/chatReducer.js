import { navigate } from "../../RootNavigation";

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
    case "REQUEST_DELETE_CONVERSATION":
      return {
        ...state,
        isDeleting: true,
      };
    case "REQUEST_DELETE_CONVERSATION:SUCCESS":
      return {
        ...initialState,
        isDeleting: false,
      };
    case "REQUEST_DELETE_CONVERSATION:ERROR":
      return {
        ...state,
        isFetchingConversations: false,
      };
    case "REQUEST_CONVERSATIONS":
      return {
        ...state,
        isFetchingConversations: true,
      };
    case "REQUEST_CONVERSATIONS:SUCCESS":
      return {
        ...state,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
        isFetchingConversations: false,
        ...action.data,
      };
    case "RECEIVE_CONVERSATIONS:ERROR":
      return {
        ...state,
        isFetchingConversations: false,
      };
    case "REQUEST_CONVERSATION":
      return {
        ...state,
        isFetchingConversation: true,
      };
    case "REQUEST_CONVERSATION:SUCCESS":
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
        isFetchingConversation: false,
      };
    case "RECEIVE_CONVERSATION:ERROR":
      return {
        ...state,
        isFetchingConversation: false,
      };
    case "RECEIVE_MESSAGE":
      return {
        ...state,
        lastUpdatedAt: action.receivedAt,
        conversations: !action.newConv
          ? [
              {
                ...state.conversations.filter(
                  (conv) => conv._id === action.conversation._id
                )[0],
                lastMessage: action.message,
                messages: [
                  action.message,
                  ...state.conversations.filter(
                    (conv) => conv._id === action.conversation._id
                  )[0].messages,
                ],
              },
              ...state.conversations.filter(
                (conv) => conv._id !== action.conversation._id
              ),
            ]
          : [
              { ...action.conversation, messages: [action.message] },
              ...state.conversations,
            ],
        isLoaded: true,
      };
    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    default:
      return state;
  }
}
