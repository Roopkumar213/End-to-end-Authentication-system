// src/components/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import AuthLayout from './AuthLayout';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // email + otp passed from OtpForm
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!email || !otp) {
    // If someone lands here directly, kick them back
    navigate('/forgot-password');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirm) {
      setError('Please enter and confirm your new password');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-with-otp', {
        email,
        otp,          // backend also accepts "code", but otp is fine
        password,
      });

      if (res.data?.ok) {
        // after reset, send user to login
        navigate('/login', { state: { resetSuccess: true } });
      } else {
        setError(res.data?.error || 'Failed to reset password');
      }
    } catch (err) {
      console.error('reset-with-otp error', err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Server error while resetting password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle={`Reset password for ${email}`}
    >
      <div className="auth-form-wrapper">
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

        <Form onSubmit={handleSubmit} className="modern-form">
          <Form.Group className="mb-4 modern-form-group" controlId="newPassword">
            <Form.Label className="modern-form-label">New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="modern-input"
            />
          </Form.Group>

          <Form.Group className="mb-4 modern-form-group" controlId="confirmPassword">
            <Form.Label className="modern-form-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              className="modern-input"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="modern-btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </Form>
      </div>
    </AuthLayout>
  );
}
