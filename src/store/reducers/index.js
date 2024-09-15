import { combineReducers } from "redux";

import categoriesReducer from "./categories";
import userReducer from "./user";

const reducer = combineReducers({
  categories: categoriesReducer,
  user: userReducer,
});

export default reducer;
