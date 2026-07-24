import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDataThunk } from "../../thunkActionsCreator/blogThunks";

function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Blog() {
  const dispatch = useDispatch();
  const { posts, categories, loading, loadingMore, error, page, hasMore } =
    useSelector((state) => state.blog);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchBlogDataThunk({ page: 1, perPage: 6 }));
  }, [dispatch]);

  useEffect(() => {
    const onScroll = () => {
      if (loading || loadingMore || !hasMore) return;

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300;

      if (nearBottom) {
        dispatch(fetchBlogDataThunk({ page: page + 1, perPage: 6 }));
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [dispatch, loading, loadingMore, hasMore, page]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return posts;

    return posts.filter((post) =>
      post.categories.includes(Number(activeCategory)),
    );
  }, [activeCategory, posts]);

  if (loading) {
    return <div style={{ padding: 24 }}>Chargement des articles...</div>;
  }

  if (error) {
    return <div style={{ padding: 24 }}>{error}</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Blog</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Découvrez nos derniers articles classés par catégorie.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <label
          htmlFor="blog-category-select"
          style={{ fontWeight: 600, color: "#374151" }}
        >
          Catégorie :
        </label>
        <select
          id="blog-category-select"
          value={activeCategory}
          onChange={(event) => setActiveCategory(event.target.value)}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "8px 12px",
            minWidth: 220,
          }}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <p>Aucun article disponible pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              style={{
                border: "1px solid #e5e5e5",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                {post.titleText || "Sans titre"}
              </h3>
              <p style={{ margin: "4px 0", color: "#666", fontSize: 14 }}>
                {formatDate(post.date)}
              </p>
              <p style={{ margin: "8px 0 12px", lineHeight: 1.6 }}>
                {post.excerptText ||
                  "Lire l’article complet sur le site WordPress."}
              </p>
            </article>
          ))}
        </div>
      )}

      {loadingMore && (
        <p style={{ marginTop: 20 }}>Chargement de plus d’articles...</p>
      )}
      {!hasMore && !loading && (
        <p style={{ marginTop: 20 }}>Tous les articles ont été chargés.</p>
      )}
    </div>
  );
}
