// src/pages/Contact.js
import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import ContactForm from "../components/ContactForm";
import { submitContact as postContact } from "../api/endpoints";
import Toast from "../components/Toast";

export default function Contact() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = "Contact — WebStudio";
  }, []);

  const handleSubmit = async (payload) => {
    try {
      const res = await postContact(payload);
      setToast({
        type: "success",
        message: `Submitted! ID: ${res.data.id} at ${new Date(
          res.data.createdAt
        ).toLocaleString()}`,
      });
      return res;
    } catch (err) {
      setToast({
        type: "error",
        message: err?.message || "Submission failed",
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

      <main className="bg-light min-vh-100 py-5">
        <div className="container py-4">
          <div className="row g-5 align-items-start">

            {/* Left Content */}
            <div className="col-12 col-md-6">
              <h1 className="fw-bold mb-3">Contact</h1>
              <p className="mb-4">
                Tell us about your project. Share details like timeline, budget,
                and goals — we’ll reply with the next steps.
              </p>

              <h4 className="fw-semibold mt-4">Office</h4>
              <p className="text-muted mb-3">
                123 Creative Street <br />
                San Francisco, CA 94102
              </p>

              <h4 className="fw-semibold mt-4">Email</h4>
              <p className="mb-0">
                <a href="mailto:hello@webstudio.com" className="link-primary">
                  hello@webstudio.com
                </a>
              </p>
            </div>

            {/* Right Contact Form */}
            <div className="col-12 col-md-6">
              {/* Your ContactForm already converted to Bootstrap */}
              <ContactForm onSubmit={handleSubmit} disabled={false} />
            </div>

          </div>
        </div>
      </main>

      {/* Toast Notification */}
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
