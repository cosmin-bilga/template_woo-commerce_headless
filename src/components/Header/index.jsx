import "./index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../slices/filtersSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filters = useSelector((state) => state.filters);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleSearchRedirect = (e) => {
    if (e.key === "Enter") navigate("/catalogue");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          {/* Burger menu mobile */}
          <button
            className="header-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          {/* Logo */}
          <Link to="/" className="header-logo" aria-label="Ecommerce">
            <img src="/logo.webp" alt="Logo" />
          </Link>
        </div>

        {/* Overlay mobile */}
        <div
          className={`header-overlay ${menuOpen ? "open" : ""}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Navigation */}
        <nav
          className={`header-nav ${menuOpen ? "open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <button
            className="header-close"
            onClick={closeMenu}
            aria-label="Fermer le menu"
          >
            ✕
          </button>

          <Link to="/" onClick={closeMenu}>
            Accueil
          </Link>
          <Link to="/catalogue" onClick={closeMenu}>
            Catalogue
          </Link>
          <Link to="/blog" onClick={closeMenu}>
            Blog
          </Link>
        </nav>

        <div className="header-actions">
          <label htmlFor="search">Rechercher:</label>
          <input
            id="search"
            type="search"
            className="header-search"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchRedirect}
            aria-label="Rechercher"
          />

          <Link to="/catalogue" className="header-icon" aria-label="Recherche">
            🔍
          </Link>

          <Link to="/profil" className="header-icon" aria-label="Profil">
            👤
          </Link>

          <Link to="/panier" className="header-icon" aria-label="Panier">
            🛒
          </Link>
        </div>
      </div>
    </header>
  );
}
