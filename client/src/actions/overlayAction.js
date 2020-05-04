export const showOverlay = ({
  notification,
  form,
  menu,
  timeout,
  callbacks,
  redirect,
}) => {
  return {
    type: "SHOW_OVERLAY",
    payload: {
      notification,
      form,
      menu,
      timeout,
      callbacks,
      redirect,
    },
  };
};

export const resetOverlay = () => {
  return {
    type: "RESET_OVERLAY",
  };
};
