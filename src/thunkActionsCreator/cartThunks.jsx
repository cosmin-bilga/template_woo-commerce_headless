import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCart, setNonce } from "../slices/cartSlice";

export const initializeCartThunk = createAsyncThunk(
  "cart/initialize",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart`,
      );
      if (!response.ok) {
        throw new Error("Impossible de récupérer le panier initial.");
      }
      const serverNonce = response.headers.get("Nonce");
      if (serverNonce) {
        thunkAPI.dispatch(setNonce(serverNonce));
      }
      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addProductToCart = createAsyncThunk(
  "cart/addProduct",
  async ({ productId, quantity, variation = [] }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const currentNonce = state.cart.nonce;

      if (!currentNonce) {
        throw new Error("Jeton de session manquant.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/add-item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Nonce: currentNonce,
          },
          body: JSON.stringify({ id: productId, quantity, variation }),
        },
      );

      if (!response.ok)
        throw new Error("Impossible d'ajouter l'article au panier.");

      // Si WooCommerce renouvelle le jeton dans la réponse, on met à jour le store et le localStorage
      const nextNonce = response.headers.get("Nonce");
      if (nextNonce && nextNonce !== currentNonce) {
        thunkAPI.dispatch(setNonce(nextNonce));
      }

      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteProductFromCart = createAsyncThunk(
  "cart/deleteProduct",
  async ({ itemKey }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const currentNonce = state.cart.nonce;

      if (!currentNonce) {
        throw new Error("Jeton de session manquant.");
      }
      console.log(itemKey);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/remove-item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Nonce: currentNonce,
          },
          body: JSON.stringify({ key: itemKey }),
        },
      );

      if (!response.ok)
        throw new Error("Impossible de supprimer l'article du panier.");

      // Si WooCommerce renouvelle le jeton dans la réponse, on met à jour le store et le localStorage
      const nextNonce = response.headers.get("Nonce");
      if (nextNonce && nextNonce !== currentNonce) {
        thunkAPI.dispatch(setNonce(nextNonce));
      }

      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
