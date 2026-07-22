import { addProductToCart } from "../../thunkActionsCreator/cartThunks";
import { useDispatch } from "react-redux";
import { Link, redirect } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const addProduct = (productId, quantity, variation) => {
    dispatch(
      addProductToCart({
        productId,
        quantity,
        variation,
      }),
    );
  };

  return (
    <div>
      <Link to={"/product/" + product.slug}>
        <p>{product.name || "-"}</p>
        <p>Marque: {product.brands?.[0]?.name}</p>
        <img
          src={
            product.images[0]?.src ||
            "https://placeholder.pics/svg/300/DEDEDE/555555/Placeholder"
          }
          alt={product.name || "photo produit"}
        />
      </Link>
      <p>
        Prix: {(product.prices.price / 100).toFixed(2) || "-.--"}
        {" " + product.prices.currency_symbol}
      </p>

      {/* Prix promotionnel s'il y en a */}
      {product.prices.regular_price > product.prices.sale_price ? (
        <p>
          Reduction de{" "}
          {Math.round(
            ((parseInt(product.prices.regular_price) -
              parseInt(product.prices.sale_price)) /
              parseInt(product.prices.regular_price)) *
              100,
          )}
          %. Prix initial:{" "}
          {(product.prices.regular_price / 100).toFixed(2) +
            " " +
            product.prices.currency_symbol}
        </p>
      ) : null}

      {product.is_in_stock ? <p>En stock</p> : <p>Rupture de stock</p>}
      <button
        disabled={!product.is_in_stock}
        onClick={() => addProduct(product.id, 1, [])}
      >
        Ajouter au panier
      </button>
    </div>
  );
}
