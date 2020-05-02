import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import overlayReducer from "./overlayReducer";
import jobsReducer from "./jobsReducer";
import chatReducer from "./chatReducer";

export default combineReducers({
  auth: authReducer,
  overlay: overlayReducer,
  jobs: jobsReducer,
  users: usersReducer,
  chat: chatReducer,
});
