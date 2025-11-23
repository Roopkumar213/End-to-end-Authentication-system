// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ResetPassword from "./components/auth/ResetPassword";
import OAuthSuccess from "./components/auth/OAuthSuccess";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import OtpForm from "./components/auth/OtpForm";
import ForgotPassword from "./components/auth/ForgotPassword";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const FullPageSpinner = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  // If already logged in, no need to see login/signup/etc -> go to main app
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  console.log("AdminRoute isAdmin:", isAdmin);
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function AppLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Protected site pages – ONLY after login */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio/:id"
            element={
              <ProtectedRoute>
                <PortfolioDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* Protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="p-5">Dashboard - Protected Content</div>
              </ProtectedRoute>
            }
          />

          {/* Admin routes (separate from user auth) */}
          <Route
            path="/admin/login"
            element={
              // admin login itself should be public
              <AdminLogin />
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* User auth routes – visible ONLY when logged out */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <OtpForm />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/oauth-success"
            element={
              <PublicRoute>
                <OAuthSuccess />
              </PublicRoute>
            }
          />

          {/* Catch-all: send to root; guards will handle redirect to login if needed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  // Router wraps AuthProvider because hooks inside use navigation
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
