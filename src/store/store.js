import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.jsx";
import habitReducer from "./habitSlice.jsx";

const store = configureStore({
  reducer: {
    auth: authReducer,
    habit: habitReducer,
  },
});

export default store;
