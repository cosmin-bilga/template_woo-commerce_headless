import { useSelector, useDispatch } from "react-redux";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector((state) => state.cart.totals);
  const dispatch = useDispatch();

  console.log(items);

  return (
    <>
      <div>Votre Panier</div>
      <ul>
        {items.map((item) => (
          <li style={{ display: "flex", gap: "10px" }}>
            <img
              src={item.images[0].thumbnail}
              style={{ width: "100px", height: "100px" }}
            ></img>
            <p>{item.name}</p>
            <span
              dangerouslySetInnerHTML={{ __html: item.short_description }}
            ></span>
            <p>{item.quantity}</p>
            <button
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
            <button onClick={() => {}}>Reduire -</button>
            <button onClick={() => {}}>Supprimer</button>
          </li>
        ))}
      </ul>
    </>
  );
}
