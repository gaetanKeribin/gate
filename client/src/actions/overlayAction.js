export const showOverlay = ({
  notification,
  form,
  menu,
  timeout,
  dispatchCallback,
  redirect,
}) => {
  return {
    type: "SHOW_OVERLAY",
    payload: {
      notification,
      form,
      menu,
      timeout,
      dispatchCallback,
      redirect,
    },
  };
};

export const resetOverlay = () => {
  return {
    type: "RESET_OVERLAY",
  };
};
