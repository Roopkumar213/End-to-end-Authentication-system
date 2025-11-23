import React, { useEffect, useRef, useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { uploadImage, createPortfolio, updatePortfolio } from '../api/endpoints';
import useFocusTrap from '../hooks/useFocusTrap';

/**
 * AdminPortfolioForm
 *
 * This form uses the upload-first approach:
 * 1) Upload image via POST /api/upload/image -> { success:true, url }
 * 2) Send JSON to POST /api/portfolio or PUT /api/portfolio/:id with { title, description, tags, imageUrl }
 *
 * Props:
 * - initial: optional PortfolioItem to edit
 * - onCancel: function
 * - onSaved: function(values) when saved (returns created/updated item)
 *
 * The form is keyboard accessible and uses useFocusTrap to trap focus when rendered in a modal.
 */
const AdminPortfolioForm = ({ initial = null, onCancel = () => {}, onSaved = () => {} }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [tagsRaw, setTagsRaw] = useState(initial?.tags ? initial.tags.join(', ') : '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const rootRef = useRef(null);

  useFocusTrap(rootRef, true);

  useEffect(() => {
    // restore fields if initial changes
    if (initial) {
      setTitle(initial.title || '');
      setDescription(initial.description || '');
      setTagsRaw(initial.tags ? initial.tags.join(', ') : '');
      setImageUrl(initial.imageUrl || '');
      setError(null); // Clear any previous errors
    }
  }, [initial]);

  const handleFile = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadImage(fd);
      setImageUrl(res.url);
    } catch (err) {
      setError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!imageUrl) {
      setError('Please upload an image.');
      return;
    }

    setSaving(true);
    try {
      if (initial?._id) {
        const res = await updatePortfolio(initial._id, { title, description, tags, imageUrl });
        onSaved(res.data);
      } else {
        const res = await createPortfolio({ title, description, tags, imageUrl });
        onSaved(res.data);
      }
    } catch (err) {
      setError(err?.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .portfolio-form-container {
          animation: fadeIn 0.3s ease-out;
        }

        .form-group-custom {
          margin-bottom: 1.5rem;
        }

        .form-label-custom {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }

        .form-label-custom.required::after {
          content: '*';
          color: #ef4444;
          margin-left: 0.25rem;
        }

        .form-input-custom {
          width: 100%;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          color: #1e293b;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(203, 213, 225, 0.5);
          border-radius: 12px;
          transition: all 0.2s ease;
          outline: none;
          font-family: inherit;
        }

        .form-input-custom:focus {
          background: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .form-input-custom::placeholder {
          color: #94a3b8;
        }

        .form-textarea-custom {
          width: 100%;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          color: #1e293b;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(203, 213, 225, 0.5);
          border-radius: 12px;
          transition: all 0.2s ease;
          outline: none;
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
          line-height: 1.6;
        }

        .form-textarea-custom:focus {
          background: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .form-hint {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .form-hint svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }

        .image-preview-container {
          margin-top: 1rem;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border: 2px solid rgba(203, 213, 225, 0.5);
        }

        .image-preview {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }

        .image-preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-preview-container:hover .image-preview-overlay {
          opacity: 1;
        }

        .image-preview-badge {
          background: white;
          color: #6366f1;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 12px;
          margin-top: 0.75rem;
        }

        .upload-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(99, 102, 241, 0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .upload-text {
          color: #6366f1;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .error-alert {
          padding: 1rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05));
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          margin-top: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
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
        }

        .form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(203, 213, 225, 0.3);
        }

        .btn-form-custom {
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          border: 2px solid rgba(203, 213, 225, 0.5);
        }

        .btn-cancel:hover {
          background: white;
          color: #475569;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .btn-submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .btn-submit:hover:not(:disabled)::before {
          opacity: 1;
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .tags-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .tag-badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 500;
          color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        @media (max-width: 640px) {
          .form-actions {
            flex-direction: column-reverse;
            gap: 0.5rem;
          }

          .btn-form-custom {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div ref={rootRef} className="portfolio-form-container" role="dialog" aria-modal="true" aria-label="Portfolio form">
        <form onSubmit={handleSubmit}>
          
          {/* Title Field */}
          <div className="form-group-custom">
            <label htmlFor="title" className="form-label-custom required">Project Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input-custom"
              placeholder="Enter a compelling project title"
              required
              autoFocus
            />
            <div className="form-hint">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Make it clear and descriptive</span>
            </div>
          </div>

          {/* Description Field */}
          <div className="form-group-custom">
            <label htmlFor="description" className="form-label-custom required">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea-custom"
              placeholder="Describe your project, its goals, and key features..."
              required
            />
            <div className="form-hint">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Provide details that showcase your work</span>
            </div>
          </div>

          {/* Tags Field */}
          <div className="form-group-custom">
            <label htmlFor="tags" className="form-label-custom">Tags</label>
            <input
              id="tags"
              type="text"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              className="form-input-custom"
              placeholder="e.g., Web Design, React, UI/UX"
            />
            <div className="form-hint">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <span>Separate tags with commas</span>
            </div>
            {tagsRaw && (
              <div className="tags-preview">
                {tagsRaw.split(',').map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                  <span key={idx} className="tag-badge">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload Field */}
          <div className="form-group-custom">
            <label className="form-label-custom required">Project Image</label>
            <ImageUploader onFileSelected={handleFile} uploading={uploading} />
            
            {uploading && (
              <div className="upload-indicator">
                <div className="upload-spinner"></div>
                <span className="upload-text">Uploading image...</span>
              </div>
            )}

            {imageUrl && !uploading && (
              <div className="image-preview-container">
                <img 
                  src={imageUrl} 
                  alt="Project preview" 
                  className="image-preview"
                />
                <div className="image-preview-overlay">
                  <div className="image-preview-badge">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Image Ready
                  </div>
                </div>
              </div>
            )}

            {!imageUrl && !uploading && (
              <div className="form-hint">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Upload a high-quality image (recommended: 1200x800px)</span>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="error-alert" role="alert">
              <svg className="error-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn-form-custom btn-cancel"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-form-custom btn-submit"
            >
              <span className="btn-content">
                {saving ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    {initial ? 'Update Project' : 'Create Project'}
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminPortfolioForm;