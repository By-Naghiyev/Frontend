import React, { useState } from 'react';

const HeaderEditor = ({ data, onChange }) => {
  const [header, setHeader] = useState(data.header);

  const update = (patch) => {
    const next = { ...header, ...patch };
    setHeader(next);
    onChange({ ...data, header: next });
  };

  const updateImage = (id, field, value) => {
    const images = header.images.map(img => img.id === id ? { ...img, [field]: value } : img);
    update({ images });
  };

  const addImage = () => {
    const newImg = { id: `h${Date.now()}`, url: '', alt: 'Header image' };
    update({ images: [...header.images, newImg] });
  };

  const removeImage = (id) => {
    update({ images: header.images.filter(i => i.id !== id) });
  };

  return (
    <div>
      {/* Text content */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Hero Text</div>
            <div className="adm-card-subtitle">Headline, subheading, and button labels</div>
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label">Subtitle (small text above headline)</label>
          <input
            className="adm-input"
            value={header.subtitle}
            onChange={e => update({ subtitle: e.target.value })}
            placeholder="HAND MADE LUXURY"
          />
        </div>
        <div className="adm-field">
          <label className="adm-label">Main Headline</label>
          <textarea
            className="adm-textarea"
            value={header.title}
            onChange={e => update({ title: e.target.value })}
            placeholder="Transform your home…"
          />
        </div>
        <div className="adm-row">
          <div className="adm-field">
            <label className="adm-label">Button 1 Label (outlined)</label>
            <input
              className="adm-input"
              value={header.cta1Label}
              onChange={e => update({ cta1Label: e.target.value })}
              placeholder="DISCOVER COLLECTION"
            />
          </div>
          <div className="adm-field">
            <label className="adm-label">Button 2 Label (filled)</label>
            <input
              className="adm-input"
              value={header.cta2Label}
              onChange={e => update({ cta2Label: e.target.value })}
              placeholder="Order Now"
            />
          </div>
        </div>
      </div>

      {/* Slider images */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Slider Images</div>
            <div className="adm-card-subtitle">Enter image URLs — paste a direct image link or a relative path like /assets/img/header/header1.png</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addImage}>+ Add Image</button>
        </div>

        <div className="adm-list">
          {header.images.map((img) => (
            <div key={img.id} className="adm-list-item">
              {img.url
                ? <img src={img.url} alt={img.alt} className="adm-img-preview" onError={e => e.target.style.display='none'} />
                : <div className="adm-img-placeholder">No Image</div>
              }
              <div className="adm-list-item-body">
                <div className="adm-field" style={{marginBottom:8}}>
                  <label className="adm-label">Image URL</label>
                  <input
                    className="adm-input"
                    value={img.url}
                    onChange={e => updateImage(img.id, 'url', e.target.value)}
                    placeholder="https://… or /assets/img/header/header1.png"
                  />
                </div>
                <div className="adm-field" style={{marginBottom:0}}>
                  <label className="adm-label">Alt text</label>
                  <input
                    className="adm-input"
                    value={img.alt}
                    onChange={e => updateImage(img.id, 'alt', e.target.value)}
                    placeholder="Header image"
                  />
                </div>
              </div>
              <div className="adm-list-item-actions">
                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => removeImage(img.id)} title="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="adm-section-gap" />
        <button className="adm-add-strip" onClick={addImage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Add slider image
        </button>
      </div>
    </div>
  );
};

export default HeaderEditor;