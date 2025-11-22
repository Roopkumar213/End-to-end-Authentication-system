// src/components/Modal.js
import React, { useEffect, useRef } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  // manage focus when opening/closing
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      // make dialog focusable then focus it
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
      // prevent body scroll while modal open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // simple focus trap
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-backdrop fade show"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        padding: "1rem",
      }}
      onMouseDown={(e) => {
        // close when clicking on backdrop (but not when clicking inside dialog)
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="document"
        tabIndex={-1}
        style={{
          maxWidth: "800px",
          width: "100%",
          outline: "none",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ borderRadius: 8 }}>
          <div className="modal-header">
            <h5 className="modal-title" id="modal-title">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
