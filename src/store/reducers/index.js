import { combineReducers } from "redux";

import categoriesReducer from "./categories";
import userReducer from "./user";
import tasksReducer from "./tasks";

const reducer = combineReducers({
  categories: categoriesReducer,
  user: userReducer,
  tasks: tasksReducer,
});

export default reducer;
