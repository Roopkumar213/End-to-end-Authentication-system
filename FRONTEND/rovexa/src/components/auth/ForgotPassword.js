// src/components/auth/ForgotPassword.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const API_TIMEOUT = 15000; // ms

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const redirectTimer = useRef(null);

  const auth = useAuth();
  const sendOtpFromCtx = auth && typeof auth.sendOtp === 'function';
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const validateEmail = (val) => {
    if (!val) {
      setValidationError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(val)) {
      setValidationError('Email is invalid');
      return false;
    }
    setValidationError('');
    return true;
  };

  const sendOtpFallback = (emailAddr) => api.post('/api/auth/send-otp', { email: emailAddr });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const normalized = email.trim().toLowerCase();
    if (!validateEmail(normalized)) return;

    setLoading(true);
    try {
      let result;
      if (sendOtpFromCtx) {
        // race with timeout to avoid hanging
        result = await Promise.race([
          auth.sendOtp(normalized),
          new Promise((_, rej) => setTimeout(() => rej(new Error('sendOtp timeout')), API_TIMEOUT)),
        ]);
        if (result && (result.success === false || result.ok === false)) {
          throw new Error(result.error || result.message || 'Failed to send code');
        }
      } else {
        const res = await sendOtpFallback(normalized);
        result = res && res.data;
      }

      setSuccess(true);
      // navigate to verify page after short delay for UX
      redirectTimer.current = setTimeout(() => {
        navigate('/verify-otp', { state: { email: normalized } });
      }, 700);
    } catch (err) {
      if (err?.isAxiosError) {
        if (err.response) {
          setError(err.response.data?.error || err.response.data?.message || `Server ${err.response.status}`);
        } else if (err.request) {
          setError('No response from server — check network or backend.');
        } else {
          setError(err.message || 'Request error');
        }
      } else {
        setError(err?.message || 'An unexpected error occurred');
      }
      // keep console for debugging
      // eslint-disable-next-line no-console
      console.error('ForgotPassword error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="We'll send you a code to reset your password">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && <Alert variant="success">If the account exists, a code has been sent. Redirecting...</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-4" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError('');
            }}
            isInvalid={!!validationError}
            disabled={loading || success}
            autoFocus
            style={{ maxWidth: 420 }}
          />
          <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading || success}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Sending code...
            </>
          ) : (
            'Send Reset Code'
          )}
        </Button>
      </Form>

      <div className="text-center mt-4">
        <Link to="/login" className="text-primary">
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
