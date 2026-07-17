import "./index.css";

import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./slices/cartSlice";
import { productsSlice } from "./slices/productSlice";
import { categoriesSlice } from "./slices/categoriesSlice";
import { filtersSlice } from "./slices/filtersSlice";

import { initializeCartThunk } from "./thunkActionsCreator/cartThunks";

import Store from "./pages/Store";
import Header from "./components/Header";
import Error404 from "./pages/Error404";

const store = configureStore({
  reducer: {
    //user: userReducer,
    cart: cartSlice.reducer,
    categories: categoriesSlice.reducer,
    products: productsSlice.reducer,
    filters: filtersSlice.reducer,
  },
});

store.dispatch(initializeCartThunk());

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  </Provider>,
  /* </React.StrictMode>, */
);
