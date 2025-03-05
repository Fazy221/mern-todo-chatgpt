import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchTodos } from "./todosSlice";

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await axios.get("http://localhost:5000/auth/check", {
    withCredentials: true,
  });
  return response.data;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { dispatch }) => {
    const response = await axios.post(
      "http://localhost:5000/auth/login",
      { username, password },
      { withCredentials: true }
    );
    dispatch(fetchTodos()); // Fetch todos after successful login
    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.get("http://localhost:5000/auth/logout", {
    withCredentials: true,
  });
  localStorage.removeItem("authState"); // Remove auth state from local storage on logout
  return false;
});

const initialState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
  error: null,
};

const persistedState =
  JSON.parse(localStorage.getItem("authState")) || initialState;

const authSlice = createSlice({
  name: "auth",
  initialState: persistedState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        localStorage.setItem("authState", JSON.stringify(state)); // Persist auth state to local storage
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem("authState", JSON.stringify(state)); // Persist auth state to local storage
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
