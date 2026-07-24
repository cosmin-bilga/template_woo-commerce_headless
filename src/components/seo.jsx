import { Helmet } from "react-helmet-async";

const SITE_NAME = "[Nom de la boutique]";
const DEFAULT_TITLE = "[Nom de la boutique]";
const DEFAULT_DESCRIPTION = "[Description par défaut du site, une phrase].";

const stripHtml = (value) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function Seo({
  title,
  description,
  image,
  url,
  type = "website",
  jsonLd,
  noIndex = false,
  lang = "fr",
}) {
  const cleanTitle = stripHtml(title);
  const cleanDescription = stripHtml(description);
  const finalTitle = cleanTitle ? `${cleanTitle}` : DEFAULT_TITLE;
  const finalDescription = cleanDescription || DEFAULT_DESCRIPTION;
  const cardType = image ? "summary_large_image" : "summary";

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />

      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content={cardType} />

      {url && <meta property="og:url" content={url} />}
      {url && <link rel="canonical" href={url} />}
      {image && <meta property="og:image" content={image} />}

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export default Seo;
