// src/components/ImageUploader.js
import React, { useState, useRef, useEffect } from "react";

/**
 * Premium Image Uploader Component
 * 
 * Props:
 * - onFileSelected: function(file) - called when file is selected (parent handles upload)
 * - uploading: boolean - external upload state
 * - currentImage: string - optional current image URL
 */
export default function ImageUploader({ onFileSelected, uploading = false, currentImage = null }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateFile = (file) => {
    if (!file) {
      return "No file selected";
    }

    if (!file.type.startsWith("image/")) {
      return "Please select an image file (JPG, PNG, GIF, etc.)";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Pass file to parent
    onFileSelected(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleRemove = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .image-uploader-container {
          width: 100%;
        }

        .upload-zone {
          position: relative;
          border: 2px dashed rgba(203, 213, 225, 0.5);
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(248, 249, 250, 0.9), rgba(233, 236, 239, 0.9));
          min-height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .upload-zone:hover {
          border-color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
          transform: translateY(-2px);
        }

        .upload-zone.drag-active {
          border-color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          transform: scale(1.02);
        }

        .upload-zone.has-image {
          padding: 0;
          border: 2px solid rgba(203, 213, 225, 0.5);
        }

        .upload-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        .upload-icon svg {
          width: 32px;
          height: 32px;
        }

        .upload-text {
          text-align: center;
          padding: 0 2rem;
        }

        .upload-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .upload-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 1rem;
        }

        .upload-hint {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .image-preview-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 240px;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.6));
          border-radius: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 1.5rem;
        }

        .upload-zone:hover .image-overlay {
          opacity: 1;
        }

        .overlay-actions {
          display: flex;
          gap: 0.75rem;
        }

        .overlay-btn {
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .overlay-btn-change {
          background: white;
          color: #6366f1;
        }

        .overlay-btn-change:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
        }

        .overlay-btn-remove {
          background: rgba(239, 68, 68, 0.9);
          color: white;
        }

        .overlay-btn-remove:hover {
          background: #ef4444;
          transform: translateY(-2px);
        }

        .overlay-btn svg {
          width: 16px;
          height: 16px;
        }

        .upload-loading {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          border-radius: 14px;
          animation: fadeIn 0.3s ease-out;
        }

        .upload-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .upload-loading-text {
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .error-message {
          margin-top: 1rem;
          padding: 0.875rem 1rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05));
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          animation: fadeIn 0.3s ease-out;
        }

        .error-icon {
          width: 20px;
          height: 20px;
          color: #ef4444;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .error-text {
          color: #dc2626;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.5;
          flex: 1;
        }

        .file-input-hidden {
          display: none;
        }

        @media (max-width: 640px) {
          .upload-zone {
            min-height: 200px;
          }

          .upload-icon {
            width: 48px;
            height: 48px;
          }

          .upload-icon svg {
            width: 24px;
            height: 24px;
          }

          .upload-text {
            padding: 0 1rem;
          }

          .upload-title {
            font-size: 0.95rem;
          }

          .overlay-actions {
            flex-direction: column;
            width: 100%;
          }

          .overlay-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="image-uploader-container">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="file-input-hidden"
          aria-label="Upload image file"
          disabled={uploading}
        />

        <div
          className={`upload-zone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-image' : ''}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="image-preview-wrapper">
              <img src={preview} alt="Preview" className="image-preview" />
              
              <div className="image-overlay">
                <div className="overlay-actions">
                  <button
                    type="button"
                    className="overlay-btn overlay-btn-change"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    disabled={uploading}
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Change
                  </button>
                  <button
                    type="button"
                    className="overlay-btn overlay-btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                    disabled={uploading}
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>

              {uploading && (
                <div className="upload-loading">
                  <div className="upload-spinner"></div>
                  <span className="upload-loading-text">Uploading image...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="upload-text">
              <div className="upload-icon">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <div className="upload-title">
                {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
              </div>
              <div className="upload-subtitle">
                JPG, PNG, GIF up to 5MB
              </div>
              <div className="upload-hint">
                Recommended: 1200 x 800 pixels
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message" role="alert">
            <svg className="error-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>
    </>
  );
}