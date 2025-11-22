// src/components/ImageUploader.js
import React, { useState, useRef } from "react";
import { uploadImage } from "../api/endpoints";

export default function ImageUploader({ onUpload, currentImage }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      // send as FormData — matches typical backend expectations
      const fd = new FormData();
      fd.append("image", file);

      const res = await uploadImage(fd);
      // assume res contains the uploaded image URL (adjust if your API returns different)
      const url = res?.url || res?.data?.url || res;
      onUpload(url);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Upload failed");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-100">
      <div className="mb-3">
        {preview ? (
          <div className="card mb-2">
            <div style={{ position: "relative" }}>
              <img
                src={preview}
                alt="Preview"
                className="card-img-top"
                style={{ objectFit: "cover", height: 220, width: "100%" }}
              />
              {uploading && (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    color: "#fff",
                  }}
                >
                  <div className="spinner-border text-light" role="status" aria-hidden="true" />
                  <span className="ms-2">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="border border-dashed rounded mb-2 d-flex align-items-center justify-content-center"
            style={{ height: 220, background: "#f8f9fa" }}
          >
            <div className="text-muted">No image selected</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="d-none"
        aria-label="Upload image file"
      />

      <div className="d-grid">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn btn-outline-secondary"
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              Uploading...
            </>
          ) : (
            "Choose Image"
          )}
        </button>
      </div>

      {error && <div className="mt-2 text-danger small">{error}</div>}
    </div>
  );
}
