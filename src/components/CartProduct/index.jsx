import {
  addProductToCart,
  deleteProductFromCart,
  substractProductFromCart,
} from "../../thunkActionsCreator/cartThunks";
import { useDispatch } from "react-redux";
import "./index.css";

export function CartProduct({ item }) {
  const dispatch = useDispatch();

  return (
    <li className="cart-product-list">
      <img
        className="cart-product-thumbnail"
        src={
          item.images?.[0]?.thumbnail ||
          "https://placeholder.pics/svg/300/DEDEDE/555555/Produit%20sans%20illustration"
        }
      ></img>
      <p>{item.name || "produit sans nom"}</p>
      <span
        dangerouslySetInnerHTML={{
          __html:
            item.short_description || item.description || "pas de description",
        }}
      ></span>
      <p>{item.quantity}</p>
      <button
        disabled={item.quantity === item.quantity_limits.maximum}
        onClick={() => {
          dispatch(
            addProductToCart({
              productId: item.id,
              quantity: 1,
              variation: item.variation,
            }),
          );
        }}
      >
        Ajouter +
      </button>
      <button
        onClick={() => {
          dispatch(
            substractProductFromCart({
              itemKey: item.key,
              quantity: item.quantity,
            }),
          );
        }}
      >
        Reduire -
      </button>
      <button
        onClick={() => {
          dispatch(
            deleteProductFromCart({
              itemKey: item.key,
            }),
          );
        }}
      >
        Supprimer
      </button>
    </li>
  );
}
