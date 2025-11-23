import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @keyframes footerFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatBlob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .premium-footer {
          position: relative;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          overflow: hidden;
          animation: footerFadeIn 0.8s ease-out;
        }

        .premium-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
        }

        .footer-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }

        .footer-blob-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          top: -200px;
          left: -100px;
          animation: floatBlob 20s ease-in-out infinite;
        }

        .footer-blob-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          bottom: -150px;
          right: -50px;
          animation: floatBlob 25s ease-in-out infinite reverse;
        }

        .footer-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 4rem;
          }
        }

        .footer-section {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }

        .footer-section:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.05);
        }

        .brand-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          animation: shimmer 3s linear infinite;
          letter-spacing: -0.02em;
        }

        .brand-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-bottom: 1rem;
        }

        .brand-description {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
          border: 1px solid rgba(99, 102, 241, 0.1);
          color: #64748b;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .social-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .social-icon svg {
          position: relative;
          z-index: 1;
          width: 20px;
          height: 20px;
          transition: all 0.25s ease;
        }

        .social-icon:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 24px -4px rgba(99, 102, 241, 0.3);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .social-icon:hover::before {
          opacity: 1;
        }

        .social-icon:hover svg {
          color: white;
        }

        .social-icon:focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #334155;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, transparent);
          border-radius: 9999px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-link {
          color: #64748b;
          text-decoration: none;
          font-size: 0.95rem;
          display: inline-block;
          position: relative;
          transition: all 0.2s ease;
          padding: 0.25rem 0;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.25s ease;
          border-radius: 9999px;
        }

        .footer-link:hover {
          color: #6366f1;
          transform: translateX(4px);
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .contact-info {
          list-style: none;
          padding: 0;
          margin: 0;
          color: #64748b;
          font-size: 0.95rem;
        }

        .contact-info li {
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          position: relative;
          line-height: 1.6;
        }

        .contact-info li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5rem;
          width: 4px;
          height: 4px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
          margin: 2rem 0;
          border-radius: 9999px;
        }

        .footer-copyright {
          text-align: center;
          padding-top: 2rem;
        }

        .copyright-text {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0;
          letter-spacing: 0.02em;
        }

        @media (max-width: 767px) {
          .footer-container {
            padding: 3rem 1rem 1.5rem;
          }

          .footer-grid {
            gap: 1.5rem;
          }

          .footer-section {
            padding: 1.5rem;
          }

          .brand-title {
            font-size: 1.75rem;
          }

          .section-title {
            font-size: 0.8rem;
          }
        }
      `}</style>

      <footer className="premium-footer mt-auto">
        <div className="footer-blob footer-blob-1"></div>
        <div className="footer-blob footer-blob-2"></div>

        <div className="footer-container">
          <div className="footer-grid">
            
            {/* Brand + Description */}
            <div className="footer-section">
              <div className="brand-badge">Premium Digital Studio</div>
              <h3 className="brand-title">WebStudio</h3>
              <p className="brand-description">
                Creating exceptional digital experiences that drive results and inspire users.
              </p>

              {/* Social Icons */}
              <div className="social-links">
                {/* Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Twitter"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="GitHub"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.58 9.58 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h5 className="section-title">Quick Links</h5>
              <ul className="footer-links">
                <li><Link className="footer-link" to="/services">Services</Link></li>
                <li><Link className="footer-link" to="/portfolio">Portfolio</Link></li>
                <li><Link className="footer-link" to="/about">About</Link></li>
                <li><Link className="footer-link" to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-section">
              <h5 className="section-title">Contact</h5>
              <ul className="contact-info">
                <li>hello@webstudio.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Creative Street</li>
                <li>San Francisco, CA 94102</li>
              </ul>
            </div>

          </div>

          <div className="footer-divider"></div>

          <div className="footer-copyright">
            <p className="copyright-text">
              © {currentYear} WebStudio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}