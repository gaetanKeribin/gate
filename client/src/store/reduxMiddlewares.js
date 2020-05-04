import io from "socket.io-client";
import axios from "axios";
import { apiConfig } from "../config";
import { showOverlay } from "../actions/overlayAction";

export const devMiddleware = (store) => (next) => (action) => {
  console.log(action.type);
  return next(action);
};

export const socketMiddleware = () => {
  let socket;
  return (store) => (next) => (action) => {
    if (!socket && store.getState().auth.isLoggedIn) {
      console.log("socket somehow disconnected");
    }
    if (
      action.type === "REQUEST_LOG_IN:SUCCESS" ||
      action.type === "REQUEST_SIGN_UP:SUCCESS" ||
      action.type === "REQUEST_VERIFY_TOKEN:SUCCESS"
    ) {
      const { token } = action.data;
      socket = io(apiConfig.baseUrl.replace("/api/", ""), {
        forceNode: true,
        transportOptions: {
          polling: {
            extraHeaders: {
              "Access-Control-Allow-Origin": "*",
              authorization: token,
            },
          },
        },
      });
      socket.on("connected", (data) => {
        console.log("Socket connected");
      });
      socket.on("unauthorized", (data) => {
        console.log("Socket disconnected");
      });
      socket.on("authenticated", (data) => {
        console.log("Socket authenticated");
      });
      socket.on("private-conversation", (data) => {
        store.dispatch({
          type: "RECEIVE_PRIVATE_CONVERSATION",
          ...data,
          receivedAt: new Date(),
        });
      });
      socket.on("private-conversation-ack", (data) => {
        store.dispatch({
          type: "PRIVATE_CONVERSATION_ACK",
          ...data,
          receivedAt: new Date(),
        });
      });
      socket.on("private-message", (data) => {
        store.dispatch({
          type: "RECEIVE_PRIVATE_MESSAGE",
          ...data,
          receivedAt: new Date(),
        });
      });
      socket.on("private-message-ack", (data) => {
        store.dispatch({
          type: "PRIVATE_MESSAGE_ACK",
          ...data,
          receivedAt: new Date(),
        });
      });
    }
    if (action.type?.substring(0, 6) === "SOCKET") {
      socket.emit(action.event, action.payload);
    }
    if (action.type === "REQUEST_LOG_OUT:SUCCESS") {
      socket.disconnect();
      console.log("socket disconnected");
    }

    return next(action);
  };
};

export const axiosMiddleware = (store) => (next) => (action) => {
  if (
    action.type?.substring(0, 7) === "REQUEST" &&
    action.type?.includes(":") === false
  ) {
    let https;
    if (action.type.substring(0, 14) === "REQUEST_UPLOAD") {
      https = axios.create({
        baseURL: apiConfig.baseUrl,
        timeout: 3000,
        headers: {
          accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${store.getState().auth.token}`,
        },
      });
    } else {
      https = axios.create({
        baseURL: apiConfig.baseUrl,
        timeout: 3000,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getState().auth.token}`,
        },
      });
    }
    const request = new Promise(function (resolve, reject) {
      let res;

      switch (action.method) {
        case "GET":
          res = https.get(action.route);
          return resolve(res);
        case "POST":
          res = https.post(action.route, action.payload);
          return resolve(res);
        case "DELETE":
          res = https.delete(action.route, action.payload);
          return resolve(res);
        case "PATCH":
          res = https.patch(action.route, action.payload);
          return resolve(res);
        default:
          return;
      }
    });
    request
      .then((res) => {
        if (action.successNotification) {
          store.dispatch(
            showOverlay({
              timeout: 3000,
              redirect: action.successNotification.redirect,
              callbacks: action.successNotification.callbacks,
              notification: {
                variant: "success",
                message: action.successNotification.message,
              },
            })
          );
        }
        return store.dispatch({
          type: `${action.type}:SUCCESS`,
          data: res.data,
          receivedAt: new Date(),
        });
      })
      .catch((err) => {
        console.log(err);
        if (
          action.errorNotification ||
          err.response?.data.forceReconnect === true
        ) {
          store.dispatch(
            showOverlay({
              timeout: 3000,
              redirect: err.response?.data.forceReconnect && "Auth",
              callbacks: err.response?.data.forceReconnect && [
                "REQUEST_LOG_OUT:SUCCESS",
              ],
              notification: {
                variant: "error",
                message: err.response?.data.message || "Cela n'a pas marché...",
              },
            })
          );
        }
        return store.dispatch({
          type: `${action.type}:ERROR`,
          error: err,
          receivedAt: new Date(),
        });
      });

    return next(action);
  } else {
    return next(action);
  }
};
