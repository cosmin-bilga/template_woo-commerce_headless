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
  async (params = {}, thunkAPI) => {
    try {
      const page = Number(params.page || 1);
      const perPage = Number(params.perPage || 6);

      const [postsResponse, categoriesResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_fields=id,date,title,excerpt,link,categories,slug`,
        ),
        page === 1
          ? fetch(
              `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/categories?per_page=100`,
            )
          : Promise.resolve(null),
      ]);

      if (!postsResponse.ok) {
        throw new Error("Impossible de charger les articles du blog.");
      }

      const postsData = await postsResponse.json();
      const categoriesData =
        page === 1 ? await categoriesResponse.json() : null;

      const normalizedPosts = postsData.map((post) => ({
        ...post,
        titleText: stripHtml(post.title?.rendered || post.title || ""),
        excerptText: stripHtml(post.excerpt?.rendered || ""),
      }));

      const groupedCategories = categoriesData
        ? categoriesData
            .filter((category) => category.count > 0)
            .map((category) => ({
              ...category,
              posts: normalizedPosts.filter((post) =>
                post.categories.includes(category.id),
              ),
            }))
            .filter((category) => category.posts.length > 0)
        : [];

      return {
        posts: normalizedPosts,
        categories: groupedCategories,
        page,
        hasMore: postsData.length === perPage,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Une erreur est survenue lors du chargement du blog.",
      );
    }
  },
);
