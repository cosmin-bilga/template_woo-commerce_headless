import { createAsyncThunk } from "@reduxjs/toolkit";

function stripHtml(value = "") {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const fetchBlogDataThunk = createAsyncThunk(
  "blog/fetchData",
  async (_, thunkAPI) => {
    try {
      const [postsResponse, categoriesResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/posts?per_page=20&_fields=id,date,title,excerpt,link,categories,slug`,
        ),
        fetch(
          `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/categories?per_page=100`,
        ),
      ]);

      if (!postsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Impossible de charger les articles du blog.");
      }

      const postsData = await postsResponse.json();
      const categoriesData = await categoriesResponse.json();

      const normalizedPosts = postsData.map((post) => ({
        ...post,
        titleText: stripHtml(post.title?.rendered || post.title || ""),
        excerptText: stripHtml(post.excerpt?.rendered || ""),
      }));

      const groupedCategories = categoriesData
        .filter((category) => category.count > 0)
        .map((category) => ({
          ...category,
          posts: normalizedPosts.filter((post) =>
            post.categories.includes(category.id),
          ),
        }))
        .filter((category) => category.posts.length > 0);

      return {
        posts: normalizedPosts,
        categories: groupedCategories,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Une erreur est survenue lors du chargement du blog.",
      );
    }
  },
);
