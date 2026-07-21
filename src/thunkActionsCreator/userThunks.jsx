import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/jwt-auth/v1/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Identifiants incorrects.");
      }
      return {
        token: data.token,
        profile: {
          email: data.user_email,
          displayName: data.user_display_name,
          nicename: data.user_nicename,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  "user/register",
  async ({ username, email, password }, thunkAPI) => {
    try {
      // Endpoint custom a exposer cote WordPress (mu-plugin), au meme titre
      // que le CORS : WordPress ne permet pas la creation de compte anonyme
      // via son API par defaut. On attend en reponse un token, comme pour le
      // login, pour eviter un deuxieme aller-retour reseau.
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Impossible de creer le compte.");
      }
      return {
        token: data.token,
        profile: {
          email: data.user_email,
          displayName: data.user_display_name,
          nicename: data.user_nicename,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
