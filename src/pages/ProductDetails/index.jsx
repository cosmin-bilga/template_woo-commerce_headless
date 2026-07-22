import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Importation des actions (thunks)
import { fetchProductByIdThunk } from "../../thunkActionsCreator/productsThunks";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, singleProduct, loadingSingle, errorSingle } = useSelector(
    (state) => state.products,
  );

  const productFromList = list?.data?.find(
    (p) => p.id.toString() === id.toString(),
  );
  const productToDisplay = productFromList || singleProduct;

  useEffect(() => {
    if (id && !productFromList) {
      dispatch(fetchProductByIdThunk(id));
    }
  }, [id, dispatch, productFromList, singleProduct]);

  // Fonction pour ajouter ce produit spécifique au panier
  const handleAddToCart = () => {
    if (productToDisplay && productToDisplay.id) {
      dispatch(
        addProductToCart({
          productId: productToDisplay.id,
          quantity: 1,
          variation: [],
        }),
      );
    }
  };

  if (loadingSingle && !productToDisplay) {
    return <div className="loading-state">Chargement en cours...</div>;
  }

  if (errorSingle && !productToDisplay) {
    return <div className="error-state">Erreur : {errorSingle}</div>;
  }

  if (!productToDisplay) {
    return <div className="not-found-state">Aucun produit trouvé.</div>;
  }

  return (
    <div className="product-page-wrapper">
      <button className="back-to-store-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Retour
      </button>

      <div className="product-top-block">
        <div className="image-left-side">
          {productToDisplay.images && productToDisplay.images.length > 0 && (
            <img
              src={
                productToDisplay.images[1]?.src ||
                productToDisplay.images[0]?.src
              }
              alt={productToDisplay.name}
            />
          )}
          <span className="wishlist-heart-decorative">♡</span>
        </div>

        <div className="main-info-container">
          <h1 dangerouslySetInnerHTML={{ __html: productToDisplay.name }}></h1>

          <p className="product-price">
            {productToDisplay.prices?.price
              ? `${(parseFloat(productToDisplay.prices.price) / 100).toFixed(2)} ${productToDisplay.prices.currency_code || "EUR"}`
              : "Prix non disponible"}
          </p>

          <div
            className="short-description-box"
            dangerouslySetInnerHTML={{
              __html:
                productToDisplay.short_description ||
                "<p>Aucune introduction disponible.</p>",
            }}
          />

          {/* Le bouton d'ajout au panier est maintenant connecté via onClick */}
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <i className="fas fa-shopping-cart cart-btn-icon"></i>
            Ajouter au panier
          </button>
        </div>
      </div>

      <div className="product-bottom-block">
        <div className="details-content-row">
          <div
            className="text-left-side wordpress-content"
            dangerouslySetInnerHTML={{
              __html:
                productToDisplay.description ||
                "<p>Aucune description disponible.</p>",
            }}
          />
        </div>
      </div>
    </div>
  );
}
