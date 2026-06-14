import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as habitsApi from "../api/habits-api";

export const fetchHabits = createAsyncThunk(
  "habit/fetchHabits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await habitsApi.getHabits();
      const raw = res.data.data;
      return Array.isArray(raw) ? raw : raw?.habits ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const createHabit = createAsyncThunk(
  "habit/createHabit",
  async (data, { rejectWithValue }) => {
    try {
      const res = await habitsApi.createHabit(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const updateHabit = createAsyncThunk(
  "habit/updateHabit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await habitsApi.updateHabit(id, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const deleteHabit = createAsyncThunk(
  "habit/deleteHabit",
  async (id, { rejectWithValue }) => {
    try {
      await habitsApi.deleteHabit(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const completeHabitThunk = createAsyncThunk(
  "habit/completeHabit",
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const res = await habitsApi.completeHabit(id, note || "");
      return { id, data: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const initialState = {
  habits: [],
  loading: false,
  error: null,
};

const habitSlice = createSlice({
  name: "habit",
  initialState,
  reducers: {
    resetHabitState: () => initialState,
    clearHabitState: (state) => {
      state.habits = [];
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setReduxHabits: (state, action) => {
      state.habits = Array.isArray(action.payload) ? action.payload : [];
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.unshift(action.payload);
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(
          (h) => h._id === action.payload._id,
        );
        if (index !== -1) state.habits[index] = action.payload;
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter((h) => h._id !== action.payload);
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.error = action.payload;
      });
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
