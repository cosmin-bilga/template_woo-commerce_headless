import { useState } from "react";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!consent || !email) return;
    alert("Merci pour votre inscription !");
    setEmail("");
    setConsent(false);
  };

  return (
    <footer className="footer">
      <div className="footer_grid">

        <div className="footer_col">
          <h6 className="footer_col-title">À propos</h6>
          <ul className="footer_links">
            <li><a href="#">La marque</a></li>
            <li><a href="#">Nos engagements</a></li>
            <li><a href="#">Notre Savoir-Faire</a></li>
            <li><a href="#">Les boutiques</a></li>
            <li><a href="#">Notre site de fourniture de café pour professionnels</a></li>
            <li><a href="#">Les avis dans la presse</a></li>
          </ul>
        </div>

        <div className="footer_col">
          <h6 className="footer_col-title">Besoin d'aide</h6>
          <ul className="footer_links">
            <li><a href="#">Foire aux questions</a></li>
            <li><a href="#">Conditions générales d'utilisation</a></li>
            <li><a href="#">Conditions générales de vente</a></li>
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">Nous contacter</a></li>
            <li><a href="#">Recrutement</a></li>
          </ul>
        </div>

        <div className="footer_col">
          <h6 className="footer_col-title">Newsletter</h6>
          <p className="footer_newsletter-text">
            Vous voulez être tenu au courant de nos actualités, des privilèges
            et autres infos importantes ? Inscrivez-vous !
          </p>
          <form className="footer_form" onSubmit={handleSubscribe}>
            <div className="footer_form-row">
              <input
                type="email"
                className="footer_input"
                placeholder="Adresse e-mail *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer_btn">
                Je m'abonne !
              </button>
            </div>
            <label className="footer_checkbox-label">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <span>
                J'accepte de recevoir des emails concernant les produits et
                services Méo (Vous aurez à tout moment la possibilité de vous
                désinscrire de nos communications).*
              </span>
            </label>
          </form>
        </div>

      </div>

      <div className="footer_bottom">
        <p>© {new Date().getFullYear()} Méo. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
