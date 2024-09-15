import { SET_TASKS } from "../actions";

const initial = {};

const tasksReducer = (state = initial, action) => {
  switch (action.type) {
    case SET_TASKS:
      const category = action.payload.category_id;
      return action.payload;

    default:
      return state;
  }
};

export default tasksReducer;
