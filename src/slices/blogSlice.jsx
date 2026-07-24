import { createSlice } from "@reduxjs/toolkit";
import { fetchBlogDataThunk } from "../thunkActionsCreator/blogThunks";

const initialState = {
  posts: [],
  categories: [],
  loading: false,
  error: null,
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.categories = action.payload.categories;
      })
      .addCase(fetchBlogDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export default blogSlice.reducer;
