const initialState = {
  notification: null,
  form: null,
  show: false,
  timeout: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "SHOW_OVERLAY":
      return {
        ...action.payload,
        show: true,
      };
    case "ASK_USER_INPUT":
      return {
        form: action.form,
        show: true,
      };
    case "RESET_OVERLAY":
      return initialState;
    default:
      return state;
  }
}
