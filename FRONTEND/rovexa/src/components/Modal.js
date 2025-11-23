import React, { useEffect, useRef } from 'react';

/**
 * Premium Modal Component
 * 
 * Props:
 * - isOpen: boolean - controls modal visibility
 * - onClose: function - called when modal should close
 * - title: string - modal header title
 * - children: ReactNode - modal content
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
          overflow-y: auto;
        }

        .modal-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
          margin: auto;
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(203, 213, 225, 0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
          border-radius: 20px 20px 0 0;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .modal-close-btn:hover {
          background: white;
          color: #ef4444;
          transform: rotate(90deg);
        }

        .modal-close-btn svg {
          width: 20px;
          height: 20px;
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
        }

        @media (max-width: 640px) {
          .modal-container {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
            margin: 0;
          }

          .modal-header {
            padding: 1.25rem 1.5rem;
            border-radius: 0;
          }

          .modal-title {
            font-size: 1.1rem;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .modal-backdrop {
            padding: 0;
            align-items: stretch;
          }
        }

        @media (min-width: 641px) {
          .modal-backdrop {
            align-items: center;
            padding: 2rem;
          }
        }
      `}</style>

      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-container" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;