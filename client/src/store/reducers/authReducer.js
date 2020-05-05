const initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isFetchingUserInfo: false,
  isLoggedIn: false,
  loggedInAt: null,
  user: null,
  userInfoUpdatedAt: null,
  userInfoError: null,
  authError: null,
  logOutError: null,
  isSigningUp: false,
  token: null,
  userInfoUpdatedAt: null,
  signUpError: null,
  isDeletingAccount: false,
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
        signUpError: null,
      };
    case "REQUEST_SIGN_UP":
      return {
        ...state,
        isSigningUp: true,
        signUpError: null,
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
        logInError: null,
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
        signUpError: null,
        ...action.data,
      };
    case "REQUEST_DELETE_ACCOUNT:SUCCESS":
    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    case "REQUEST_UPDATE_USER:SUCCESS":
      return {
        ...state,
        updateUserError: null,
        isUpdatingUser: false,
        userInfoUpdatedAt: action.receivedAt,
        ...action.data,
      };
    case "REQUEST_MY_JOBS:SUCCESS":
      return {
        ...state,
        isFetching: false,
        fetchMyJobsError: null,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
        ...action.data,
      };
    case "REQUEST_UPLOAD_FILE:SUCCESS":
      return {
        ...state,
        ...action.data,
      };
    case "REQUEST_UPDATE_PASSWORD:SUCCESS":
      return { ...state, updatePasswordError: null };
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

    // ERRORS

    case "REQUEST_VERIFY_TOKEN:ERROR":
      return initialState;
    case "REQUEST_MY_JOBS:ERROR":
      return {
        ...state,
        isFetching: false,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
        fetchMyJobsError:
          "Vos offres d'emploi n'ont pas pu être récupérées, essayez de nouveau.",
      };
    case "REQUEST_UPDATE_USER:ERROR":
      return {
        ...state,
        isUpdatingUser: false,
        updateUserError:
          "Cela n'a pas marché. Peut-être le mot de passe était-il incorrect.",
      };
    case "REQUEST_UPDATE_PASSWORD:ERROR":
      return {
        ...state,
        isUpdatingPassword: false,
        updatePasswordError:
          "Cela n'a pas marché. Peut-être le mot de passe était-il incorrect.",
      };
    case "REQUEST_LOG_IN:ERROR":
      return {
        ...state,
        logInError:
          "Cela n'a pas marché. Peut-être le mot de passe était-il incorrect.",
        isLoggingIn: false,
      };
    case "REQUEST_SIGN_UP:ERROR":
      return {
        ...state,
        isSigningUp: false,
        signUpError: "Cela n'a pas marché, essayez un autre email.",
      };
    case "REQUEST_UPDATE_JOB:ERROR":
      return {
        ...state,
        ...action.state,
        isUpdatingJob: false,
      };
    case "REQUEST_CREATE_JOB:ERROR":
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
}
