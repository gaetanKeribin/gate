export const logIn = (credentials) => {
  console.log(credentials);

  return {
    type: "REQUEST_LOG_IN",
    route: "/auth/login",
    payload: credentials,
    method: "POST",
    errorNotification: true,
  };
};

export const verifyToken = () => {
  return {
    type: "REQUEST_VERIFY_TOKEN",
    route: "auth/token/verify",
    method: "GET",
    errorNotification: true,
  };
};

export const signUp = (credentials) => {
  return {
    type: "REQUEST_SIGN_UP",
    route: "/auth/signup",
    payload: credentials,
    method: "POST",
    successNotification: {
      message: `Bienvenue ! Rendez-vous à l'onglet "Mon profil" pour éditer vos informations.`,
      variant: "success",
      redirect: "Main",
      timeout: 3000,
    },
    errorNotification: true,
  };
};

export const logOut = () => {
  return {
    type: "REQUEST_LOG_OUT",
    route: "/auth/logout",
    method: "GET",
    errorNotification: true,
  };
};

export const updateUser = (user) => {
  return {
    type: "REQUEST_UPDATE_USER",
    method: "PATCH",
    route: "auth",
    payload: user,
    successNotification: {
      message: "Vos informations ont été mises à jour.",
      variant: "success",
      redirect: "Read",
      timeout: 1000,
    },
    errorNotification: true,
  };
};

export const updateUserPassword = (password, newPassword) => {
  return {
    type: "REQUEST_UPDATE_USER",
    method: "PATCH",
    route: "auth/password",
    payload: { password, newPassword },
    successNotification: {
      message: "Votre mot de passe à été mises à jour.",
      variant: "success",
      redirect: "Read",
      timeout: 1000,
    },
    errorNotification: true,
  };
};

export const deleteAccount = () => {
  return {
    type: "REQUEST_DELETE_ACCOUNT",
    method: "DELETE",
    route: "auth",
    successNotification: {
      message: "Votre compte a bien été supprimé.",
      variant: "success",
      timeout: 1000,
    },
    errorNotification: true,
  };
};
