import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import { Platform } from "react-native";
import {
  socketMiddleware,
  axiosMiddleware,
  devMiddleware,
} from "./reduxMiddlewares";
import { AsyncStorage } from "react-native";
import logger from "redux-logger";

import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["overlay"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middlewares = [thunk, devMiddleware, axiosMiddleware, socketMiddleware()];

if (Platform.OS === "web") {
  middlewares.push(logger);
}

const store = createStore(persistedReducer, applyMiddleware(...middlewares));

let persistor = persistStore(store);

export { store, persistor };
