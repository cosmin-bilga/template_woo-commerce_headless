import { useEffect } from "react";
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
  const { categories, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogDataThunk());
  }, [dispatch]);

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

      {categories.length === 0 ? (
        <p>Aucun article disponible pour le moment.</p>
      ) : (
        categories.map((category) => (
          <section key={category.id} style={{ marginBottom: 32 }}>
            <h2 style={{ marginBottom: 12 }}>{category.name}</h2>
            <div style={{ display: "grid", gap: 16 }}>
              {category.posts.map((post) => (
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
          </section>
        ))
      )}
    </div>
  );
}
