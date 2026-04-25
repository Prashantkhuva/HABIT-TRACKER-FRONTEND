import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  habits: [],
  loading: false,
};

const habitSlice = createSlice({
  name: "habit",
  initialState,
  reducers: {
    resetHabitState: () => {
      return initialState;
    },
    clearHabitState: (state) => {
      state.habits = [];
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setReduxHabits: (state, action) => {
      state.habits = action.payload; 
    },
    addReduxHabit: (state, action) => {
      state.habits.unshift(action.payload); 
    },
    updateReduxHabit: (state, action) => {
      const index = state.habits.findIndex(
        (habit) => habit._id === action.payload._id,
      );
      if (index !== -1) state.habits[index] = action.payload;
    },
    deleteReduxHabit: (state, action) => {
      state.habits = state.habits.filter(
        (habit) => habit._id !== action.payload,
      );
    },
  },
});

export const {
  resetHabitState,
  addReduxHabit,
  clearHabitState,
  setLoading,
  setReduxHabits,
  updateReduxHabit,
  deleteReduxHabit,
} = habitSlice.actions;
export default habitSlice.reducer;
