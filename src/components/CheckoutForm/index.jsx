import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shippingAddress = {
    first_name: "Jean",
    last_name: "Dupont",
    address_1: "10 Rue de la Paix",
    city: "Paris",
    postcode: "75001",
    country: "FR",
    email: "jean.dupont@example.com",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || loading) return;
    setLoading(true);
    setError(null);
    const cardElement = elements.getElement(CardElement);
    const { paymentMethod, error: stripeError } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${shippingAddress?.first_name} ${shippingAddress?.last_name}`,
          email: shippingAddress?.email,
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("wc_user_token");
    const cartRes = await fetch(
      `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      },
    );

    const freshNonce =
      cartRes.headers.get("X-WC-Store-API-Nonce") ||
      cartRes.headers.get("Nonce");
    console.log("Fresh Nonce:", await freshNonce);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/checkout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            nonce: await freshNonce,
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify({
            payment_method: "stripe",
            payment_data: [
              {
                key: "stripe_source",
                value: paymentMethod.id,
              },
              {
                key: "wc-stripe-payment-method",
                value: paymentMethod.id,
              },
              {
                key: "payment_method",
                value: paymentMethod.id,
              },
            ],
            billing_address: shippingAddress,
            shipping_address: shippingAddress,
          }),
        },
      );

      const data = await response.json();
      console.log("Checkout Response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la commande.");
      }
      if (data.payment_result?.redirect_url) {
        window.location.href =
          "http://localhost:5173/success/" + (await data.order_id);
      } else {
        alert("Commande validée avec succès !");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <CardElement />
      </div>

      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Traitement..." : "Payer maintenant"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}
