import React from 'react';
import './auth.css';

const AuthLayout = ({ children, title = 'Welcome Back!', subtitle = '' , leftContent }) => {
  return (
    <div className="auth-wrapper" role="dialog" aria-labelledby="auth-title">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left-panel" aria-hidden="false">
          <div>
            <div className="auth-brand">
              <span className="brand-web">WEB</span>
              <span className="brand-craft">CRAFT</span>
            </div>

            <div className="auth-content">
              <h2 className="auth-welcome-title">{title}</h2>
              {subtitle && <p className="auth-welcome-subtitle">{subtitle}</p>}
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="auth-decoration" aria-hidden="true">
            <div className="decoration-circle-1"></div>
            <div className="decoration-circle-2"></div>
          </div>

          {/* bottom features */}
          <div className="auth-features">
            <div className="auth-feature">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure & Encrypted</span>
            </div>
            <div className="auth-feature">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Right Panel - form area */}
        <div className="auth-right-panel">
          <div className="auth-form-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
