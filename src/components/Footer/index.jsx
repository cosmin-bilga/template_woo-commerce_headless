import { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {

  return (
    <footer className="footer">
      <div className="footer_grid">
        <div className="footer_col">
          <ul className="footer_links">
            <li><Link to="/catalogue">Acceuil</Link></li>
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/cart">Panier</Link></li>
            <li><Link to="/login">Se connecter</Link></li>
          </ul>
        </div>

        <div className="footer_col">
          <ul className="footer_links">
            <li><Link to="/cgu">Conditions générales d'utilisation</Link></li>
            <li><Link to="/cgv">Conditions générales de vente</Link></li>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/contact">Nous contacter</Link></li>
          </ul>
        </div>


      </div>


    </footer>
  );
}
