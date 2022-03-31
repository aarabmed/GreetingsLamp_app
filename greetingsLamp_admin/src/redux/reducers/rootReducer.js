import { combineReducers } from "redux";

import globalReducer from "./globalReducer";
import userReducer from "./userReducer";
import cardReducer from "./cardReducer";
import menuReducer from "./menuReducer";
import menuManagerReducer from "./menuManagerReducer"

const rootReducer = combineReducers({
  userReducer,
  globalReducer,
  cardReducer,
  menuReducer,
  menuManagerReducer
});

export default rootReducer;
