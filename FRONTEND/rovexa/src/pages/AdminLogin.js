// src/pages/AdminLogin.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { login as authLogin } from "../api/endpoints";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    try {
      const res = await authLogin({ email, password });
      const { token } = res;
      if (!token) throw new Error("No token returned from server");
      localStorage.setItem("studio_token", token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Login failed";
      setToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login — WebStudio" description="Admin login for WebStudio" />

      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="h4 mb-3">Admin Login</h2>

                  <form onSubmit={handleSubmit} aria-label="Admin login form" noValidate>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="form-control"
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </button>
                      <small className="text-muted">Use your admin credentials</small>
                    </div>
                  </form>
                </div>
              </div>

              <p className="text-center text-muted mt-3 small">
                © {new Date().getFullYear()} WebStudio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast sits in bottom-right via Toast styling */}
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
