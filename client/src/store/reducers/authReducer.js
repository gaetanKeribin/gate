const initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isSigningUp: false,
  isLoggedIn: false,
  isDeletingAccount: false,
  loggedInAt: null,
  user: null,
  userInfoUpdatedAt: null,
  token: null,
  errors: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "REQUEST_AUTH_TOKEN":
      return {
        ...state,
        ...action.data,
      };
    case "REQUEST_SIGN_UP":
      return {
        ...state,
        isSigningUp: true,
      };
    case "REQUEST_SIGN_UP":
      return {
        ...state,
        isSigningUp: true,
      };
    case "REQUEST_LOG_IN":
      return {
        ...state,
        isLoggingIn: true,
      };
    case "REQUEST_LOG_OUT":
      return {
        ...state,
        isloggingOut: true,
      };
    case "REQUEST_UPDATE_USER":
      return {
        ...state,
        isUpdatingUser: true,
      };
    case "REQUEST_DELETE_ACCOUNT":
      return {
        ...state,
        isDeletingAccount: true,
      };
    case "REQUEST_UPDATE_PASSWORD":
      return {
        ...state,
        isUpdatingPassword: true,
      };
    case "REQUEST_MY_JOBS":
      return {
        ...state,
        isFetching: true,
      };
    case "REQUEST_UPDATE_JOB":
      return {
        ...state,
        isUpdatingJob: true,
      };
    case "REQUEST_CREATE_JOB":
      return state;
    case "RECEIVE_CONVERSATION":
      return {
        ...state,
        user: {
          ...state.user,
          privateConversations: [
            ...state.user.privateConversations,
            {
              conversation_id: action.conversation._id,
              interlocutor_id: action.message.sender,
            },
          ],
        },
      };
    case "PRIVATE_CONVERSATION_ACK":
      return {
        ...state,
        user: {
          ...state.user,
          privateConversations: [
            ...state.user.privateConversations,
            {
              conversation_id: action.conversation._id,
              interlocutor_id: action.message.recipient,
            },
          ],
        },
      };

    // SUCCESS
    case "REQUEST_UPDATE_PASSWORD:SUCCESS":
      return state;
    case "REQUEST_DELETE_ACCOUNT:SUCCESS":
    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    case "REQUEST_VERIFY_TOKEN:SUCCESS":
      return {
        ...state,
        tokenVerifiedAt: action.receivedAt,
      };
    case "REQUEST_LOG_IN:SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        loggedInAt: action.receivedAt,
        userInfoUpdatedAt: action.receivedAt,
        ...action.data,
      };
    case "REQUEST_SIGN_UP:SUCCESS":
      return {
        ...state,
        isSigningUp: false,
        user: action.user,
        token: action.token,
        loggedInAt: action.receivedAt,
        isLoggedIn: true,
        userInfoUpdatedAt: action.receivedAt,
        ...action.data,
      };
    case "REQUEST_UPDATE_USER:SUCCESS":
      return {
        ...state,
        isUpdatingUser: false,
        userInfoUpdatedAt: action.receivedAt,
        ...action.data,
      };
    case "REQUEST_MY_JOBS:SUCCESS":
      return {
        ...state,
        isFetching: false,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
        ...action.data,
      };
    case "REQUEST_UPDATE_JOB:SUCCESS":
      return {
        ...state,
        user: { ...state.user, jobs: action.data.jobs },
        isUpdatingJob: false,
      };
    case "REQUEST_CREATE_JOB:SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          jobs: [action.data.job, ...state.user.jobs],
        },
      };
    case "REQUEST_DELETE_FILE:SUCCESS":
    case "REQUEST_UPLOAD_FILE:SUCCESS":
      return {
        ...state,
        user: action.data.updatedUser,
      };

    // ERRORS

    case "REQUEST_VERIFY_TOKEN:ERROR":
      return initialState;
    case "REQUEST_MY_JOBS:ERROR":
    case "REQUEST_UPDATE_USER:ERROR":
    case "REQUEST_UPDATE_PASSWORD:ERROR":
    case "REQUEST_LOG_IN:ERROR":
    case "REQUEST_SIGN_UP:ERROR":
    case "REQUEST_UPDATE_JOB:ERROR":
    case "REQUEST_CREATE_JOB:ERROR":
      return {
        ...state,
        errors: [...state.errors, action],
      };
    default:
      return state;
  }
}
