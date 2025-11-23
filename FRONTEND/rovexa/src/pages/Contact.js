// src/pages/Contact.jsx
import React, { useEffect, useState } from "react";
import { submitContact } from "../api/endpoints"; // ✅ use named export
import "./Contact.css";

// Replace with your real SEO component import if you have one
const SEO = ({ title, description }) => null;

/* ------------------------------------------------------------------ */
/* Contact Form                                                       */
/* ------------------------------------------------------------------ */

const ContactForm = ({ onSubmit, disabled }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || disabled) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("ContactForm submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={disabled || loading}
          placeholder="John Doe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={disabled || loading}
          placeholder="john@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className="form-textarea"
          rows="6"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={disabled || loading}
          placeholder="Tell us about your project..."
        />
      </div>

      <button
        type="submit"
        className="form-submit-btn"
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <span className="btn-spinner"></span>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg
              className="btn-arrow"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M4 10h12m0 0l-4-4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Toast                                                              */
/* ------------------------------------------------------------------ */

const Toast = ({ type, message, onClose, duration = 6000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast-notification toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M15 5L5 15M5 5l10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main Contact Page                                                  */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = "Contact — WebStudio";
  }, []);

  // Uses endpoints.submitContact -> POST { name, email, message } to /contact
  const handleSubmit = async (payload) => {
    try {
      const result = await submitContact(payload);
      // expecting backend JSON like: { success, message, data: { ..., createdAt } }
      const createdAt =
        result?.data?.createdAt || new Date().toISOString();

      setToast({
        type: "success",
        message: `Message sent successfully at ${new Date(
          createdAt
        ).toLocaleString()}`,
      });

      return result;
    } catch (err) {
      console.error("Contact submit error:", err);
      setToast({
        type: "error",
        message:
          err?.message || "Submission failed. Please try again.",
      });
      throw err;
    }
  };

  return (
    <>
      <SEO
        title="Contact — WebStudio"
        description="Get in touch with WebStudio"
      />

      <main className="contact-page">
        {/* Background Elements */}
        <div className="contact-bg-orb orb-1"></div>
        <div className="contact-bg-orb orb-2"></div>
        <div className="contact-bg-orb orb-3"></div>
        <div className="contact-bg-grid"></div>

        <div className="contact-container">
          <div className="contact-layout">
            {/* Left Content */}
            <div className="contact-info-section">
              <div className="info-content">
                <div className="eyebrow-badge">Get In Touch</div>

                <h1 className="contact-heading">Contact</h1>

                <p className="contact-intro">
                  Tell us about your project. Share details like timeline,
                  budget, and goals — we&apos;ll reply with the next steps.
                </p>

                <div className="contact-details">
                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="detail-content">
                      <h4 className="detail-title">Office</h4>
                      <p className="detail-text">
                        123 Creative Street
                        <br />
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="22,6 12,13 2,6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="detail-content">
                      <h4 className="detail-title">Email</h4>
                      <p className="detail-text">
                        <a
                          href="mailto:hello@webstudio.com"
                          className="email-link"
                        >
                          hello@webstudio.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="social-links">
                  <a
                    href="#"
                    className="social-link"
                    aria-label="Twitter / X"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </a>
                  <a href="#" className="social-link" aria-label="GitHub">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="contact-form-section">
              <div className="form-wrapper">
                <ContactForm onSubmit={handleSubmit} disabled={false} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={6000}
        />
      )}
    </>
  );
}
