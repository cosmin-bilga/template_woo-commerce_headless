import { createSlice } from "@reduxjs/toolkit";
import { fetchPageThunk } from "../thunkActionsCreator/pagesThunks";

export const pagesSlice = createSlice({
  name: "pages",
  initialState: {
    items: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageThunk.fulfilled, (state, action) => {
        state.loading = false;
        const page = action.payload;
        if (page && page.slug) {
          state.items[page.slug] = page;
        }
      })
      .addCase(fetchPageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export default pagesSlice.reducer;
