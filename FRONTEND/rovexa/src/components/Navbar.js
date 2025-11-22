// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, loading, logout } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // while auth state is resolving, render nothing to avoid flash
  if (loading) return null;

  // Links that should be visible only to authenticated users
  const authLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/portfolio", label: "Portfolio" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // Links for unauthenticated users
  const guestLinks = [
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
  ];

  // Return true when the link should be considered active.
  const isActive = (path) => {
    const pathname = location.pathname || "/";
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/") || pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      }
    } finally {
      // ensure user lands on login page after logout
      navigate("/login", { replace: true });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark shadow-sm" : "navbar-light bg-white shadow-sm"}`}
      style={{ zIndex: 1100 }}
      aria-label="Main navigation"
    >
      <div className="container">
        {/* BRAND */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          Web studio
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="main-navbar"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* COLLAPSE MENU */}
        <div id="main-navbar" className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            {/* Render auth-only links when signed in */}
            {isAuthenticated &&
              authLinks.map((link) => {
                const active = isActive(link.to);
                const linkClasses = [
                  "nav-link",
                  active ? "active text-primary fw-semibold" : darkMode ? "text-light" : "text-dark",
                ].join(" ");
                return (
                  <li className="nav-item" key={link.to}>
                    <Link
                      className={linkClasses}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

            {/* Render guest links when not signed in */}
            {!isAuthenticated &&
              guestLinks.map((link) => {
                const active = isActive(link.to);
                const linkClasses = [
                  "nav-link",
                  active ? "active text-primary fw-semibold" : darkMode ? "text-light" : "text-dark",
                ].join(" ");
                return (
                  <li className="nav-item" key={link.to}>
                    <Link
                      className={linkClasses}
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
                <li className="nav-item">
                  <Link
                    className={isActive("/dashboard") ? "nav-link active text-primary fw-semibold" : (darkMode ? "nav-link text-light" : "nav-link text-dark")}
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item ms-2">
                  <button
                    onClick={handleLogout}
                    className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-dark"}`}
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* DARK / LIGHT TOGGLE */}
            <li className="nav-item ms-lg-3">
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsOpen(false);
                }}
                className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-dark"}`}
                aria-pressed={darkMode}
                type="button"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
