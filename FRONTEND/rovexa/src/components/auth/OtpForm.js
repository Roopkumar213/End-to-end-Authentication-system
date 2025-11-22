// src/components/auth/OtpForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import api from '../../lib/api';
import './auth.css';

export default function OtpForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef([]);
  const { verifyOtp, sendOtp } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, rawValue) => {
    if (!/^\d*$/.test(rawValue)) return;
    const digit = rawValue.slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setOtp((prev) => {
        const next = [...prev];
        if (next[index]) {
          next[index] = '';
          return next;
        }
        if (index > 0) {
          next[index - 1] = '';
          setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
          return next;
        }
        return next;
      });
      return;
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      return;
    }
    if (e.key.length === 1 && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text') || '';
    const digits = text.replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    const next = Array.from({ length: 6 }, (_, i) => digits[i] || '');
    setOtp(next);
    const last = Math.min(digits.length - 1, 5);
    setTimeout(() => {
      inputRefs.current[last]?.focus();
      inputRefs.current[last]?.select?.();
    }, 0);
  };

const verifyFallback = async (emailAddr, code) => {
  try {
    const res = await api.post('/api/auth/verify-otp', {
      email: emailAddr,
      otp: code,
    });
    return res.data; // backend returns { success: true, ... } or { error: ... }
  } catch (err) {
    console.error('verifyFallback error:', err);
    const msg =
      err.response?.data?.error ||
      err.message ||
      'Network or server error';
    return { success: false, error: msg };
  }
};


const resendFallback = async (emailAddr) => {
  try {
    const res = await api.post('/api/auth/send-otp', { email: emailAddr });
    return res.data; // backend returns { ok: true } or similar
  } catch (err) {
    console.error('resendFallback error:', err);
    return { success: false, error: 'Network or server error' };
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = typeof verifyOtp === 'function' ? await verifyOtp(email, code) : await verifyFallback(email, code);
if (result?.success) {
  // After OTP verify, go to reset-password screen
  navigate('/reset-password', { state: { email, otp: code } });
} else {
  setError(result?.error || 'Invalid OTP');
  setOtp(['', '', '', '', '', '']);
  inputRefs.current[0]?.focus();
}

    } catch (err) {
      setError('An unexpected error occurred');
      // eslint-disable-next-line no-console
      console.error('verifyOtp error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setResendSuccess(false);
    try {
      const result = typeof sendOtp === 'function' ? await sendOtp(email) : await resendFallback(email);
      if (result?.success || result?.ok || result?.message) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        setError(result?.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP');
      // eslint-disable-next-line no-console
      console.error('sendOtp error:', err);
    } finally {
      setResendLoading(false);
    }
  };

  // debug console: remove in production
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('OTP state:', otp.join(''));
  }, [otp]);

  return (
    <AuthLayout title="Verify Email" subtitle={`Enter the 6-digit code sent to ${email}`}>
      <div className="otp-card-body">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {resendSuccess && <Alert variant="success">OTP sent successfully!</Alert>}

        <form onSubmit={handleSubmit} onPaste={handlePaste}>
          <div className="otp-input-group mb-4 d-flex justify-content-between" style={{ gap: 10 }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                className="otp-digit"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                aria-label={`OTP digit ${index + 1}`}
                autoFocus={index === 0}
                style={{
                  width: 56,
                  height: 48,
                  fontSize: 20,
                  borderRadius: 8,
                  textAlign: 'center',
                  paddingLeft: 0,
                  paddingRight: 0,
                  boxSizing: 'border-box',
                }}
              />
            ))}
          </div>

          <Button variant="primary" type="submit" className="w-100 gradient-btn mb-3" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>
        </form>

        <div className="d-flex justify-content-between align-items-center small mt-2">
          <div className="text-muted">Didn't receive the code?</div>
          <div>
            <Button variant="link" className="p-0 text-primary fw-bold resend-link" onClick={handleResend} disabled={resendLoading}>
              {resendLoading ? 'Sending...' : 'Resend'}
            </Button>
          </div>
        </div>

        <div className="otp-hint mt-3 small text-muted">Tip: You can paste a 6-digit code. Inputs auto-advance.</div>
      </div>
    </AuthLayout>
  );
}
