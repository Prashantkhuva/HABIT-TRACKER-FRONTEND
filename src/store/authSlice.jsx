import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  isAuthChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signin: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.isAuthChecked = true;
    },
    signout: (state) => {
      state.status = false;
      state.userData = null;
      state.isAuthChecked = true;
    },
    resetAuthState: () => {
      return initialState;
    },
    clearAuthState: (state) => {
      state.status = false;
      state.userData = null;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
});

export const {
  signin,
  signout,
  resetAuthState,
  clearAuthState,
  setAuthChecked,
} = authSlice.actions;

export default authSlice.reducer;
