import "./index.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";

const CARD_WIDTH = 160;
const GAP = 16;
const VIEWPORT_WIDTH = CARD_WIDTH * 3 + GAP * 2;

export default function HomeSlider() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    dispatch(
      fetchProductsThunk({
        orderby: "popularity",
        order: "desc",
        page: 1,
        per_page: 15,
      }),
    );
  }, [dispatch]);

  const products = list?.data || [];

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % products.length);
  };
  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + products.length) % products.length);
  };

  useEffect(() => {
    if (products.length === 0 || isDragging) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [products.length, isDragging]);

  const addProduct = (productId) => {
    dispatch(addProductToCart({ productId, quantity: 1, variation: [] }));
  };

  const handlePointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging || e.pointerType !== "mouse") return;
    setDragOffset(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const threshold = CARD_WIDTH / 3;
    if (dragOffset > threshold) goPrev();
    else if (dragOffset < -threshold) goNext();
    setDragOffset(0);
    setIsDragging(false);
  };

  if (loading) return <p>Chargement...</p>;
  if (products.length === 0) return null;

  // Le passage du dernier produit au premier (et inversement) ne doit pas
  // animer tout le long du track : on coupe la transition juste sur ce saut.
  const wrapped =
    (prevIndexRef.current === products.length - 1 && currentIndex === 0) ||
    (prevIndexRef.current === 0 && currentIndex === products.length - 1);
  prevIndexRef.current = currentIndex;

  const baseOffset =
    VIEWPORT_WIDTH / 2 - CARD_WIDTH / 2 - currentIndex * (CARD_WIDTH + GAP);

  return (
    <div className="home-slider">
      <h2>Produits du moment</h2>

      <div
        className="home-slider-viewport"
        style={{ width: VIEWPORT_WIDTH }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className="home-slider-track"
          style={{
            transform: `translateX(${baseOffset + dragOffset}px)`,
            transition:
              isDragging || wrapped ? "none" : "transform 0.4s ease",
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className={
                "home-slider-product" +
                (index === currentIndex ? " active" : "")
              }
              style={{ width: CARD_WIDTH }}
            >
              <Link to={"/product/" + product.slug}>
                <img
                  src={product.images[0]?.src}
                  alt={product.name}
                  draggable={false}
                />
                <p dangerouslySetInnerHTML={{ __html: product.name }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.price_html }}></p>
              </Link>
              {index === currentIndex && (
                <button onClick={() => addProduct(product.id)}>
                  Ajouter au panier
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="home-slider-buttons">
        <button onClick={goPrev}>{"<"}</button>
        <button onClick={goNext}>{">"}</button>
      </div>
    </div>
  );
}
