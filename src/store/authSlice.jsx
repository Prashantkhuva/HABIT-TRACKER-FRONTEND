import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signin: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    signout: (state) => {
      state.status = false;
      state.userData = null;
    },
    resetAuthState: () => {
      return initialState;
    },
    clearAuthState: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { signin, signout, resetAuthState, clearAuthState } =
  authSlice.actions;

export default authSlice.reducer;
