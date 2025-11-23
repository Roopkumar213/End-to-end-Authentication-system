// src/pages/AdminLogin.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import Toast from "../components/Toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = "Admin Login — WebStudio";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    const adminEmail = "roopkumar3244@gmail.com";
    const adminPassword = "Roop@210307";

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("isAdmin", "true");
      console.log("Admin login success, isAdmin set to true");
      navigate("/admin/dashboard", { replace: true });
    } else {
      console.log("Admin login failed");
      setToast({ type: "error", message: "Invalid admin credentials" });
    }

    setSubmitting(false);
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatBlob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -40px) scale(1.15);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.85);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .admin-login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
        }

        .background-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          pointer-events: none;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          top: -100px;
          left: -100px;
          animation: floatBlob 25s ease-in-out infinite;
        }

        .blob-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          bottom: -150px;
          right: -100px;
          animation: floatBlob 30s ease-in-out infinite reverse;
        }

        .blob-3 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: floatBlob 35s ease-in-out infinite;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        .login-wrapper {
          width: 100%;
          max-width: 480px;
          animation: fadeIn 0.8s ease-out;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 
            0 20px 60px -10px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset;
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .brand-section {
          text-align: center;
          margin-bottom: 2.5rem;
          animation: slideInFromLeft 0.6s ease-out 0.2s both;
        }

        .brand-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.4);
          position: relative;
        }

        .brand-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(135deg, #ec4899, #6366f1);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.5;
        }

        .brand-icon svg {
          width: 32px;
          height: 32px;
          color: white;
        }

        .brand-title {
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .brand-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-top: 0.75rem;
        }

        .admin-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .login-form {
          animation: slideInFromLeft 0.6s ease-out 0.4s both;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          font-size: 0.95rem;
          color: #1e293b;
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(203, 213, 225, 0.5);
          border-radius: 12px;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input:focus {
          background: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .input-icon {
          position: relative;
        }

        .input-icon svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #94a3b8;
          pointer-events: none;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .submit-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .submit-button:hover:not(:disabled)::before {
          opacity: 1;
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner-custom {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .footer-text {
          text-align: center;
          margin-top: 2rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          animation: fadeIn 0.8s ease-out 0.6s both;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 2rem 1.5rem;
            border-radius: 20px;
          }

          .brand-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <SEO title="Admin Login — WebStudio" description="Admin login for WebStudio" />

      <div className="admin-login-page">
        <div className="background-blob blob-1"></div>
        <div className="background-blob blob-2"></div>
        <div className="background-blob blob-3"></div>

        <div className="login-container">
          <div className="login-wrapper">
            <div className="login-card">
              <div className="brand-section">
                <div className="brand-icon">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h2 className="brand-title">WebStudio</h2>
                <p className="brand-subtitle">Admin Portal</p>
                <div className="admin-badge">Secure Access</div>
              </div>

              <form className="login-form" onSubmit={handleSubmit} aria-label="Admin login form" noValidate>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="username"
                      className="form-input"
                      placeholder="admin@webstudio.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="form-input"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={submitting}
                >
                  <span className="button-content">
                    {submitting ? (
                      <>
                        <span className="spinner-custom" role="status" aria-hidden="true" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in to Admin Panel"
                    )}
                  </span>
                </button>
              </form>
            </div>

            <p className="footer-text">
              © {new Date().getFullYear()} WebStudio. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type === "error" ? "error" : "success"}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </>
  );
}