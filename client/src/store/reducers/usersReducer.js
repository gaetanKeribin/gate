const initialState = {
  users: [],
  isFetching: false,
  lastUpdatedAt: null,
  isLoaded: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_USERS":
      return {
        ...state,
        isFetching: true
      };
    case "REQUEST_USERS:SUCCESS":
      return {
        ...action.data,
        isFetching: false,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true
      };
    case "REQUEST_USERS:ERROR":
      return {
        ...action.data,
        isFetching: false,
        lastUpdatedAt: action.receivedAt,
        isLoaded: true
      };
    case "REQUEST_LOG_OUT:SUCCESS":
      return initialState;
    default:
      return state;
  }
}
