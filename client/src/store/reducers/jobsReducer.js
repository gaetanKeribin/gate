const initialState = {
  jobs: [],
  isFetching: false,
  lastUpdatedAt: null,
  isLoaded: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_JOBS":
      return {
        ...state,
        isFetching: true
      };
    case "REQUEST_JOBS:SUCCESS":
      return {
        ...state,
        isFetching: false,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true,
        ...action.data
      };
    case "REQUEST_JOBS:ERROR":
      return {
        ...state,
        isFetching: false,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true
      };
    case "REQUEST_DELETE_JOB":
      return {
        ...state,
        isDeleting: true
      };
    case "REQUEST_DELETE_JOB:SUCCESS":
      return {
        ...state,
        isDeleting: false,
        lastUpdatedAt: action.receivedAt
      };
    case "REQUEST_CREATE_JOB:SUCCESS":
      return {
        ...state,
        jobs: [action.data.job, ...state.jobs]
      };
    case "REQUEST_DELETE_JOB:ERROR":
      return {
        ...state,
        isFetchingConversations: false
      };
    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    default:
      return state;
  }
}
