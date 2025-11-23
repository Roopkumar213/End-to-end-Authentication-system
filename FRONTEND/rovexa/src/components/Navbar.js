// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, loading, logout } = useAuth();

  // Auth-related routes where navbar should be completely hidden
  const authHiddenPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
    "/oauth-success",
    "/admin/login",
  ];

  const isAuthPage = authHiddenPaths.includes(location.pathname);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // During auth loading OR on auth pages -> no navbar at all
  if (loading || isAuthPage) return null;

  // Links that should be visible only to authenticated users
  const authLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/portfolio", label: "Portfolio" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // NOTE: guestLinks won't actually show now, because:
  // - when logged out we are always on an auth page (navbar hidden)
  // - when logged in isAuthenticated==true
  const guestLinks = [
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
  ];

  const isActive = (path) => {
    const pathname = location.pathname || "/";
    if (path === "/") return pathname === "/";
    return (
      pathname === path ||
      pathname.startsWith(path + "/") ||
      pathname.startsWith(path)
    );
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      }
    } finally {
      navigate("/login", { replace: true });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`premium-navbar ${darkMode ? "dark-mode" : "light-mode"}`}
      aria-label="Main navigation"
    >
      <div className="premium-navbar-container">
        {/* BRAND */}
        <Link className="premium-brand" to="/">
          <span className="brand-text">Web</span>
          <span className="brand-dot">.</span>
          <span className="brand-text">studio</span>
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className={`premium-hamburger ${isOpen ? "is-open" : ""}`}
          type="button"
          aria-controls="main-navbar"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* COLLAPSE MENU */}
        <div className={`premium-navbar-menu ${isOpen ? "is-open" : ""}`}>
          <ul className="premium-nav-list">
            {/* Authenticated links */}
            {isAuthenticated &&
              authLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <li className="premium-nav-item" key={link.to}>
                    <Link
                      className={`premium-nav-link ${
                        active ? "is-active" : ""
                      }`}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

            {/* Guest links - practically never rendered now, but kept for safety */}
            {!isAuthenticated &&
              guestLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <li className="premium-nav-item" key={link.to}>
                    <Link
                      className={`premium-nav-link ${
                        active ? "is-active" : ""
                      }`}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

            {/* If authenticated, show dashboard and logout controls */}
            {isAuthenticated && (
              <>
                <li className="premium-nav-item">
                  <Link
                    className={`premium-nav-link ${
                      isActive("/dashboard") ? "is-active" : ""
                    }`}
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="premium-nav-item premium-btn-item">
                  <button
                    onClick={handleLogout}
                    className="premium-btn premium-btn-outline"
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
