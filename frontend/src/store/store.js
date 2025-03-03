import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
  },
});

export default store;
