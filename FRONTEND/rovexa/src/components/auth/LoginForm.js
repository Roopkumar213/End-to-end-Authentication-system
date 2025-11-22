// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import AuthLayout from './AuthLayout';
import './auth.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // We only need refreshUser from context
  const { refreshUser } = useAuth() || {};
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await authService.login(email.trim(), password);
      console.log('LOGIN RESPONSE DATA =', data);

      if (data?.accessToken) {
        console.log('STORING TOKENS...');
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        console.log('ACCESS AFTER STORE =', localStorage.getItem('accessToken'));
        console.log('REFRESH AFTER STORE =', localStorage.getItem('refreshToken'));

        if (typeof refreshUser === 'function') {
          console.log('CALLING refreshUser()');
          await refreshUser();
        } else {
          console.log('refreshUser is not a function');
        }

        console.log('NAVIGATING TO /dashboard');
        navigate('/dashboard');
        return;
      }

      console.log('NO accessToken in login response, data =', data);
      setError(data?.error || 'Invalid email or password');
    } catch (err) {
      console.error('login error', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // ---------- GOOGLE / GITHUB OAUTH (only part changed) ----------

  const handleGoogleLogin = (e) => {
    e?.preventDefault();
    try {
      const url = authService?.getGoogleAuthUrl?.();
      console.log('Google OAuth URL =', url);
      if (!url) {
        setError('Google login is not configured correctly.');
        return;
      }
      // Full redirect to backend OAuth endpoint
      window.location.href = url;
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError('Unable to start Google login right now.');
    }
  };

  const handleGithubLogin = (e) => {
    e?.preventDefault();
    try {
      const url = authService?.getGithubAuthUrl?.();
      console.log('GitHub OAuth URL =', url);
      if (!url) {
        setError('GitHub login is not configured correctly.');
        return;
      }
      window.location.href = url;
    } catch (err) {
      console.error('GitHub OAuth error:', err);
      setError('Unable to start GitHub login right now.');
    }
  };

  // ---------------------------------------------------------------

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Access your account to manage your web solutions. Our platform offers secure and reliable tools for all your development needs."
    >
      <div className="auth-form-wrapper">
        <div className="auth-form-header">
          <h2 className="auth-form-title">Sign In</h2>
          <p className="auth-form-subtitle">Please login to your account</p>
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
          onClick={handleGoogleLogin}
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
          <span className="divider-text-modern">or continue with</span>
        </div>

        <Form onSubmit={handleSubmit} className="modern-form" noValidate>
          {/* Email */}
          <Form.Group className="mb-4 modern-form-group" controlId="loginEmail">
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
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!validationErrors.email}
                disabled={loading}
                className="modern-input"
                aria-label="Email"
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4 modern-form-group" controlId="loginPassword">
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
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!validationErrors.password}
                disabled={loading}
                className="modern-input"
                aria-label="Password"
                autoComplete="current-password"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.password}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="modern-btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Form>

        <div className="auth-footer-links">
          <span className="auth-footer-text">Don't have an account? </span>
          <Link to="/signup" className="auth-link">
            Register
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
