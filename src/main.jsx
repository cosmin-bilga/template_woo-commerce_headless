import "./index.css";

import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./slices/cartSlice";
import { productsSlice } from "./slices/productSlice";
import { categoriesSlice } from "./slices/categoriesSlice";
import { filtersSlice } from "./slices/filtersSlice";
import { userSlice } from "./slices/userSlice";
import { pagesSlice } from "./slices/pagesSlice";

import { initializeCartThunk } from "./thunkActionsCreator/cartThunks";

import Store from "./pages/Store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Error404 from "./pages/Error404";
import MentionsLegales from "./pages/MentionsLegales";
import CGU from "./pages/CGU";
import CGV from "./pages/CGV";
import User from "./pages/User";
import Cart from "./pages/Cart";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer,
    categories: categoriesSlice.reducer,
    products: productsSlice.reducer,
    filters: filtersSlice.reducer,
    pages: pagesSlice.reducer,
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
      //basename="/ecom"
    >
      <Header />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/catalogue" element={<Store />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user" element={<User />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
    </Router>
  </Provider>,
  /* </React.StrictMode>, */
);
