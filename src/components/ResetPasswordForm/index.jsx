import { useState } from "react";
import { useDispatch } from "react-redux";

import { updateModalProps } from "../../slices/modalSlice";

import "./index.css";

export default function ResetPasswordForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="resetPassword">
      <h1>Mot de passe oublié</h1>
      <p className="auth-modal__subtitle">
        Recevez un lien pour réinitialiser votre mot de passe
      </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__field">
          <label htmlFor="reset-email">Votre email</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {message && <p className="auth-form__server-error">{message}</p>}

        <button className="auth-form__submit" type="submit">
          Envoyer le lien
        </button>
      </form>

      <p className="auth-modal__footer">
        <button
          type="button"
          className="auth-modal__link"
          onClick={() => dispatch(updateModalProps({ view: "login" }))}
        >
          Retour à la connexion
        </button>
      </p>
    </div>
  );
}
