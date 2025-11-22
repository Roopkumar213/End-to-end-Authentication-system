// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ResetPassword from "./components/auth/ResetPassword";
import OAuthSuccess from './components/auth/OAuthSuccess';
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import OtpForm from "./components/auth/OtpForm";
import ForgotPassword from "./components/auth/ForgotPassword";

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
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  // Router must wrap AuthProvider because AuthProvider uses useNavigate
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignupForm /></PublicRoute>} />
                <Route path="/verify-otp" element={<PublicRoute><OtpForm /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
<Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><div className="p-5">Dashboard - Protected Content</div></ProtectedRoute>} />
<Route path="/oauth-success" element={<OAuthSuccess />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
