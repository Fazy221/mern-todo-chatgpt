import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await axios.get("http://localhost:5000/auth/check", {
    withCredentials: true,
  });
  return response.data;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }) => {
    const response = await axios.post(
      "http://localhost:5000/auth/login",
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.get("http://localhost:5000/auth/logout", {
    withCredentials: true,
  });
  return false;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
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
