import React, { useState } from 'react';
import { uploadImage } from '../services/githubService';

const ImageUploader = ({ currentUrl, onImageUploaded, folder, label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [showPicker, setShowPicker] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      setPreview(url);
      onImageUploaded(url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleUrlInput = (url) => {
    setPreview(url);
    onImageUploaded(url);
  };

  return (
    <div className="adm-image-uploader">
      <div className="adm-field">
        <label className="adm-label">{label} URL</label>
        <div className="adm-row" style={{ gap: '10px' }}>
          <input
            className="adm-input"
            value={preview || ''}
            onChange={(e) => handleUrlInput(e.target.value)}
            placeholder="https://... or /assets/img/..."
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            onClick={() => setShowPicker(!showPicker)}
          >
            Browse
          </button>
        </div>
      </div>

      {showPicker && (
        <div className="adm-card" style={{ padding: '12px', marginTop: '8px' }}>
          <div className="adm-field">
            <label className="adm-label">Upload new image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="adm-input"
            />
            {uploading && <span className="adm-spinner adm-spinner-dark" style={{ marginLeft: '10px' }} />}
          </div>
          <div className="adm-field">
            <label className="adm-label">Or use existing from gallery</label>
            <select
              className="adm-select"
              onChange={(e) => handleUrlInput(e.target.value)}
              value=""
            >
              <option value="">Select existing image...</option>
              <option value="/assets/img/header/header1.png">Header 1</option>
              <option value="/assets/img/header/header2.png">Header 2</option>
              <option value="/assets/img/about/about1.png">About 1</option>
              <option value="/assets/img/about/about2.png">About 2</option>
              <option value="/assets/img/about/about3.png">About 3</option>
              <option value="/assets/img/product/product1.png">Product 1</option>
              <option value="/assets/img/blogs/blogs1.png">Blog 1</option>
            </select>
          </div>
        </div>
      )}

      {preview && (
        <div style={{ marginTop: '10px' }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '150px',
              borderRadius: '8px',
              border: '1px solid var(--a-border)'
            }}
            onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;