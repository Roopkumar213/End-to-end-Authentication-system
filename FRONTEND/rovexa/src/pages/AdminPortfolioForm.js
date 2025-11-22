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
  const [title, setTitle] = useState(initial ? initial.title : '');
  const [description, setDescription] = useState(initial ? initial.description : '');
  const [tagsRaw, setTagsRaw] = useState(initial ? (initial.tags || []).join(', ') : '');
  const [imageUrl, setImageUrl] = useState(initial ? initial.imageUrl : '');
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
      setTagsRaw((initial.tags || []).join(', '));
      setImageUrl(initial.imageUrl || '');
    }
  }, [initial]);

  const handleFile = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadImage(fd); // { success:true, url }
      setImageUrl(res.url);
    } catch (err) {
      setError(err?.message || 'Upload failed');
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

    if (!title || !description || !imageUrl) {
      setError('Title, description and image are required.');
      return;
    }

    setSaving(true);
    try {
      if (initial && initial._id) {
        const res = await updatePortfolio(initial._id, { title, description, tags, imageUrl });
        onSaved(res.data);
      } else {
        const res = await createPortfolio({ title, description, tags, imageUrl });
        onSaved(res.data);
      }
    } catch (err) {
      setError(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label="Portfolio form">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <div className="mt-2">
            <ImageUploader onFileSelected={handleFile} uploading={uploading} />
            {imageUrl && (
              <div className="mt-3">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="img-fluid rounded border" 
                  style={{ height: '192px', width: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            <small>{error}</small>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : initial ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPortfolioForm;