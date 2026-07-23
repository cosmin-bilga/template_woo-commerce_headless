import React, { useState } from "react";

export default function Checkout() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "FR",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // 1. Récupération du panier pour obtenir Nonce + Cart-Token
      const cartResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const nonce =
        cartResponse.headers.get("Nonce") ||
        cartResponse.headers.get("X-WC-Store-API-Nonce");

      const cartToken = cartResponse.headers.get("Cart-Token");

      if (!nonce) {
        throw new Error(
          "Impossible de récupérer l'en-tête Nonce depuis WooCommerce.",
        );
      }

      // 2. Soumission de la commande
      const checkoutResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Nonce: nonce,
            ...(cartToken && { "Cart-Token": cartToken }),
          },
          credentials: "include",
          body: JSON.stringify({
            billing_address: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              address_1: formData.address,
              city: formData.city,
              postcode: formData.postalCode,
              country: formData.country,
            },
            shipping_address: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              address_1: formData.address,
              city: formData.city,
              postcode: formData.postalCode,
              country: formData.country,
            },
            payment_method: "stripe",
          }),
        },
      );

      const data = await checkoutResponse.json();

      if (checkoutResponse.ok && data.payment_result?.redirect_url) {
        // Redirection vers la page de paiement sécurisée Stripe
        window.location.href = data.payment_result.redirect_url;
      } else {
        const errorMsg =
          data.additional_errors?.[0]?.message ||
          data.message ||
          "Une erreur est survenue lors de la commande.";
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error("Erreur API :", error);
      setErrorMessage(error.message || "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Finaliser la commande</h1>

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <strong>Erreur : </strong>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>1. Informations personnelles</legend>
          <div>
            <label htmlFor="firstName">Prénom : </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lastName">Nom : </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">Adresse e-mail : </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>2. Adresse de livraison</legend>
          <div>
            <label htmlFor="address">Adresse : </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="city">Ville : </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="postalCode">Code postal : </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Redirection vers Stripe..." : "Payer avec Stripe"}
        </button>
      </form>
    </div>
  );
}
