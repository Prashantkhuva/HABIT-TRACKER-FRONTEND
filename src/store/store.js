import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.jsx";
import habitReducer from "./habitSlice.jsx";
import themeReducer from "./themeSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    habit: habitReducer,
    theme: themeReducer,
  },
});

export default store;
