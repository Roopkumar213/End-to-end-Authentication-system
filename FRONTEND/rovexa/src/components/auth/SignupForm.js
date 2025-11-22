// src/components/auth/SignupForm.js
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import AuthLayout from './AuthLayout';
import './auth.css';

export default function SignupForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useAuth() || {};
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email is invalid';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8)
      errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const name = form.name.trim();
      const email = form.email.trim();
      const password = form.password;

      // 1) Create user
      const signupResult = await authService.signup(name, email, password);
      console.log('SIGNUP RESPONSE =', signupResult);

      if (!signupResult || !signupResult.id) {
        setError(signupResult?.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // 2) Auto-login: call /login with same credentials
      const loginData = await authService.login(email, password);
      console.log('AUTO-LOGIN RESPONSE AFTER SIGNUP =', loginData);

      if (!loginData?.accessToken) {
        setError('Signup succeeded but login failed. Please try logging in.');
        setLoading(false);
        return;
      }

      // 3) Store tokens like LoginForm
      localStorage.setItem('accessToken', loginData.accessToken);
      if (loginData.refreshToken) {
        localStorage.setItem('refreshToken', loginData.refreshToken);
      }

      // 4) Update context user
      if (typeof refreshUser === 'function') {
        await refreshUser();
      }

      // 5) Go to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('signup error', err);
      const msg = err?.response?.data?.error || err?.message || 'Signup failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = (e) => {
    e.preventDefault();
    const url = authService?.getGoogleAuthUrl?.();
    if (url) window.location.href = url;
  };

  const handleGithub = (e) => {
    e.preventDefault();
    const url = authService?.getGithubAuthUrl?.();
    if (url) window.location.href = url;
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our platform to access virtual numbers for OTP verification. Sign up now for secure and reliable verification solutions."
    >
      <div className="auth-form-wrapper">
        <div className="auth-form-header">
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-subtitle">Please fill in your details</p>
        </div>

        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError('')}
            className="modern-alert"
          >
            {error}
          </Alert>
        )}

        {/* Google Login Button */}
        <Button
          variant="outline-secondary"
          className="google-btn w-100 mb-4"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg className="me-2" width="20" height="20" viewBox="0 0 533.5 544.3" aria-hidden>
            <path fill="#4285F4" d="M533.5 278.4c0-18.4-1.6-36-4.7-53.1H272v100.6h146.8c-6.4 34.7-25.4 64-54.2 83.6v69.6h87.6c51.1-47 80.3-116.6 80.3-200.7z"></path>
            <path fill="#34A853" d="M272 544.3c73.7 0 135.5-24.4 180.6-66.3l-87.6-69.6c-24 16.1-54.6 25.6-93 25.6-71 0-131.2-47.9-152.8-112.2H29.2v70.7C74.3 494 166.6 544.3 272 544.3z"></path>
            <path fill="#FBBC05" d="M119.2 321.8c-10.6-31.9-10.6-66.1 0-98l-90-70.7C6.3 195.6 0 233.1 0 272s6.3 76.4 29.2 118.9l90-69.6z"></path>
            <path fill="#EA4335" d="M272 108.3c39.8 0 75.6 13.7 103.9 40.6l77.7-77.7C404 19.6 344.8 0 272 0 166.6 0 74.3 50.3 29.2 162.1l90 70.7C140.8 156.2 201 108.3 272 108.3z"></path>
          </svg>
          Continue with Google
        </Button>

        <div className="divider-modern my-4">
          <span className="divider-text-modern">or register with email</span>
        </div>

        <Form onSubmit={onSubmit} noValidate className="modern-form">
          {/* First Name */}
          <Form.Group className="mb-4 modern-form-group" controlId="name">
            <Form.Label className="modern-form-label">First Name</Form.Label>
            <div style={{ position: 'relative' }}>
              <div className="input-icon-wrapper" aria-hidden="true">
                <svg
                  className="inline-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <Form.Control
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter your first name"
                isInvalid={!!validationErrors.name}
                disabled={loading}
                autoComplete="name"
                className="modern-input"
                aria-label="First name"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-4 modern-form-group" controlId="email">
            <Form.Label className="modern-form-label">Email</Form.Label>
            <div style={{ position: 'relative' }}>
              <div className="input-icon-wrapper" aria-hidden="true">
                <svg
                  className="inline-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Enter your email"
                isInvalid={!!validationErrors.email}
                disabled={loading}
                autoComplete="email"
                className="modern-input"
                aria-label="Email"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4 modern-form-group" controlId="password">
            <Form.Label className="modern-form-label">Password</Form.Label>
            <div style={{ position: 'relative' }}>
              <div className="input-icon-wrapper" aria-hidden="true">
                <svg
                  className="inline-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <Form.Control
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Enter your password"
                isInvalid={!!validationErrors.password}
                disabled={loading}
                autoComplete="new-password"
                className="modern-input"
                aria-label="Password"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.password}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-4 modern-form-group" controlId="confirmPassword">
            <Form.Label className="modern-form-label">Confirm Password</Form.Label>
            <div style={{ position: 'relative' }}>
              <div className="input-icon-wrapper" aria-hidden="true">
                <svg
                  className="inline-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <Form.Control
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Confirm your password"
                isInvalid={!!validationErrors.confirmPassword}
                disabled={loading}
                autoComplete="new-password"
                className="modern-input"
                aria-label="Confirm password"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.confirmPassword}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="modern-btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </Form>

        <div className="auth-footer-links">
          <span className="auth-footer-text">Already have an account? </span>
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
