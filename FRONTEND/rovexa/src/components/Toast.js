// src/components/Toast.js
import React, { useEffect } from "react";

export default function Toast({
  type = "success",
  message = "",
  onClose = () => {},
  duration = 5000,
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const alertClass = type === "success" ? "alert-success" : "alert-danger";
  const icon = type === "success" ? (
    <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{ position: "fixed", bottom: 16, right: 16, zIndex: 1080 }}
    >
      <div className={`alert ${alertClass} d-flex align-items-center shadow`} role="status">
        {icon}
        <div className="flex-grow-1 me-3" style={{ wordBreak: "break-word" }}>
          {message}
        </div>

        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
