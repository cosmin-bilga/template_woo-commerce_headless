import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "";

function stripHtml(value = "") {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Blog() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBlogData() {
      try {
        setLoading(true);
        setError("");

        const [postsResponse, categoriesResponse] = await Promise.all([
          fetch(
            `${apiBaseUrl}/wp-json/wp/v2/posts?per_page=20&_fields=id,date,title,excerpt,link,categories,slug`,
          ),
          fetch(`${apiBaseUrl}/wp-json/wp/v2/categories?per_page=100`),
        ]);

        if (!postsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Impossible de charger les articles du blog.");
        }

        const postsData = await postsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!isMounted) return;

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

        setCategories(groupedCategories);
      } catch (err) {
        if (isMounted) {
          setError(
            err.message ||
              "Une erreur est survenue lors du chargement du blog.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBlogData();

    return () => {
      isMounted = false;
    };
  }, []);

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
