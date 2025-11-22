// src/components/ContactForm.js
import React, { useState } from 'react';
import { submitContact } from '../api/endpoints';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'danger', message: string }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setAlert(null);
    try {
      await submitContact(formData);
      setAlert({ type: 'success', message: "Message sent successfully! We'll get back to you soon." });
      setFormData({ name: '', email: '', company: '', budget: '', message: '' });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to send message. Please try again.';
      setAlert({ type: 'danger', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setAlert(null)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <div id="name-error" className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <div id="email-error" className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="company" className="form-label">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="budget" className="form-label">Budget Range</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select a range</option>
            <option value="<10k">Less than $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k+">$100,000+</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && <div id="message-error" className="invalid-feedback">{errors.message}</div>}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
