import { createListenerMiddleware } from "@reduxjs/toolkit";
import { loginThunk, registerThunk } from "../thunkActionsCreator/userThunks";
import { initializeCartThunk } from "../thunkActionsCreator/cartThunks";
import { logout } from "../slices/userSlice";

// Le nonce Store API est lie a l'identite (invite vs client connecte via le
// token JWT). Quand cette identite change, on redemande un panier/nonce frais
// plutot que de garder celui de l'ancienne identite en memoire/localStorage.
export const cartIdentityListener = createListenerMiddleware();

cartIdentityListener.startListening({
  matcher: (action) =>
    loginThunk.fulfilled.match(action) ||
    registerThunk.fulfilled.match(action) ||
    logout.match(action),
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(initializeCartThunk());
  },
});
