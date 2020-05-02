import io from "socket.io-client";
import axios from "axios";
import { apiConfig } from "../config";
import { showOverlay } from "../actions/overlayAction";

export const devMiddleware = (store) => (next) => (action) => {
  console.log(action.type);
  next(action);
};

export const socketMiddleware = () => {
  let socket;
  return (store) => (next) => (action) => {
    if (typeof action === "function") {
      return next(action);
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
      socket.on("authenticated", (data) => {
        console.log("Socket authenticated");
      });
      socket.on("message", (data) => {
        store.dispatch({
          type: "RECEIVE_MESSAGE",
          message: data.message,
          conversation: data.conversation,
          newConv: data.newConv,
          receivedAt: new Date(),
        });
      });
    }
    if (socket) {
      if (action.type.substring(0, 6) === "SOCKET") {
        socket.emit(action.event, action.payload);
      }
      if (action.type === "REQUEST_LOG_OUT:SUCCESS") {
        socket.disconnect();
      }
    }
    return next(action);
  };
};

export const axiosMiddleware = (store) => (next) => (action) => {
  if (
    action.type.substring(0, 7) === "REQUEST" &&
    action.type.includes(":") === false
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
          store.dispatch({
            type: "NOTIFY_USER",
            notification: action.successNotification,
          });
        }
        return store.dispatch({
          type: `${action.type}:SUCCESS`,
          data: res.data,
          receivedAt: new Date(),
        });
      })
      .catch((err) => {
        console.log(err, err.response);
        if (
          action.errorNotification ||
          err.response.data.forceReconnect === true
        ) {
          store.dispatch(
            showOverlay({
              timeout: 3000,
              dispatchCallback:
                err.response?.data.forceReconnect && "REQUEST_LOG_OUT:SUCCESS",
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

    next(action);
  } else {
    next(action);
  }
};
