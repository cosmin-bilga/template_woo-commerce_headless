import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCart, setNonce } from "../slices/cartSlice";

const buildCartHeaders = (thunkAPI, currentNonce) => {
  const token = thunkAPI.getState().user.token;
  return {
    "Content-Type": "application/json",
    ...(currentNonce && { Nonce: currentNonce }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const initializeCartThunk = createAsyncThunk(
  "cart/initialize",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
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

export const emptyCartThunk = createAsyncThunk(
  "cart/empty",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const currentNonce = state.cart.nonce;

    if (!currentNonce) {
      throw new Error("Jeton de session manquant.");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/items`,
        {
          method: "DELETE",
          headers: buildCartHeaders(thunkAPI, currentNonce),
        },
      );
      if (!response.ok) {
        throw new Error("Impossible de récupérer le panier initial.");
      }
      const serverNonce = response.headers.get("Nonce");
      if (serverNonce) {
        thunkAPI.dispatch(setNonce(serverNonce));
      }
      const cartData = await response.json();
      cartData.items = [];
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
          headers: buildCartHeaders(thunkAPI, currentNonce),
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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/remove-item`,
        {
          method: "POST",
          headers: buildCartHeaders(thunkAPI, currentNonce),
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

export const substractProductFromCart = createAsyncThunk(
  "cart/substractProduct",
  async ({ itemKey, quantity }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const currentNonce = state.cart.nonce;

      if (!currentNonce) {
        throw new Error("Jeton de session manquant.");
      }

      let url = "";
      let body = {};

      if (quantity > 1) {
        url = `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/update-item`;
        body = {
          method: "POST",
          headers: buildCartHeaders(thunkAPI, currentNonce),
          body: JSON.stringify({
            key: itemKey,
            quantity: quantity - 1,
          }),
        };
      } else {
        url = `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/remove-item`;
        body = {
          method: "POST",
          headers: buildCartHeaders(thunkAPI, currentNonce),
          body: JSON.stringify({ key: itemKey }),
        };
      }

      const response = await fetch(url, body);

      if (!response.ok) throw new Error("Impossible de modifier l'article.");

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
