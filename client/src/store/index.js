import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import {
  socketMiddleware,
  axiosMiddleware,
  devMiddleware,
} from "./reduxMiddlewares";
import AsyncStorage from "@react-native-community/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // whitelist: ["authReducer"],
  blacklist: ["overlay"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middlewares = [thunk, devMiddleware, axiosMiddleware, socketMiddleware()];

const store = createStore(persistedReducer, applyMiddleware(...middlewares));

let persistor = persistStore(store);

// store.subscribe(() => {
//   // console.log("new client state", store.getState().auth);
// });

export { store, persistor };
