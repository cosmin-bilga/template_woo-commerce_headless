import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, registerThunk } from "../thunkActionsCreator/userThunks";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    token:
      typeof window !== "undefined" ? localStorage.getItem("wc_user_token") : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.token = null;
      localStorage.removeItem("wc_user_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.profile = action.payload.profile;
        localStorage.setItem("wc_user_token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.profile = action.payload.profile;
        localStorage.setItem("wc_user_token", action.payload.token);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
