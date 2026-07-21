import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPageThunk = createAsyncThunk(
  "pages/fetchBySlug",
  async (params = {}, thunkAPI) => {
    try {
      const slug = typeof params === "string" ? params : params && params.slug;
      if (!slug) {
        return thunkAPI.rejectWithValue(
          "Le slug de la page est requis pour récupérer la page.",
        );
      }

      const state = thunkAPI.getState();
      const existing =
        state.pages && state.pages.items && state.pages.items[slug];
      if (existing) {
        return existing;
      }

      const rawParams = typeof params === "string" ? {} : { ...params };
      delete rawParams.slug;
      const cleanParams = Object.entries(rawParams).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = String(value);
          }
          return acc;
        },
        {},
      );

      const queryString = new URLSearchParams(cleanParams).toString();
      const url = `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(
        slug,
      )}${queryString ? `&${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue("Impossible de récupérer la page.");
      }
      const data = await response.json();
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return thunkAPI.rejectWithValue("Page non trouvée");
      }

      const item = Array.isArray(data) ? data[0] : data;
      const page = {
        title: (item.title && (item.title.rendered || item.title)) || null,
        content:
          (item.content && (item.content.rendered || item.content)) || null,
        slug: item.slug || slug,
      };

      return page;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
