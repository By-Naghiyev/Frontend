import React, { useState } from 'react';

const AboutEditor = ({ data, onChange }) => {
  const [about, setAbout] = useState(data.about);

  const update = (patch) => {
    const next = { ...about, ...patch };
    setAbout(next);
    onChange({ ...data, about: next });
  };

  const updateParagraph = (idx, value) => {
    const paragraphs = about.paragraphs.map((p, i) => i === idx ? value : p);
    update({ paragraphs });
  };

  const addParagraph = () => update({ paragraphs: [...about.paragraphs, ''] });
  const removeParagraph = (idx) => update({ paragraphs: about.paragraphs.filter((_, i) => i !== idx) });

  const updateImage = (id, field, value) => {
    const images = about.images.map(img => img.id === id ? { ...img, [field]: value } : img);
    update({ images });
  };
  const addImage = () => update({ images: [...about.images, { id: `a${Date.now()}`, url: '', alt: 'About image' }] });
  const removeImage = (id) => update({ images: about.images.filter(i => i.id !== id) });

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Section Title & Text</div>
            <div className="adm-card-subtitle">Edit the About Us heading and paragraphs</div>
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label">Section Title</label>
          <input
            className="adm-input"
            value={about.title}
            onChange={e => update({ title: e.target.value })}
            placeholder="About us"
          />
        </div>

        <div className="adm-card-header" style={{marginTop:16, paddingTop:16, borderTop:'1px solid var(--a-border)', borderBottom:'none', marginBottom:12}}>
          <div className="adm-card-title" style={{fontSize:13}}>Paragraphs</div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addParagraph}>+ Add Paragraph</button>
        </div>

        <div className="adm-list">
          {about.paragraphs.map((para, idx) => (
            <div key={idx} className="adm-list-item" style={{alignItems:'flex-start'}}>
              <div className="adm-list-item-body">
                <label className="adm-label">Paragraph {idx + 1}</label>
                <textarea
                  className="adm-textarea"
                  value={para}
                  onChange={e => updateParagraph(idx, e.target.value)}
                  style={{minHeight:70}}
                />
              </div>
              <div className="adm-list-item-actions" style={{marginTop:20}}>
                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => removeParagraph(idx)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="adm-section-gap" />
        <button className="adm-add-strip" onClick={addParagraph}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Add paragraph
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Slider Images</div>
            <div className="adm-card-subtitle">Images shown in the About section image slider</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addImage}>+ Add Image</button>
        </div>

        <div className="adm-list">
          {about.images.map((img) => (
            <div key={img.id} className="adm-list-item">
              {img.url
                ? <img src={img.url} alt={img.alt} className="adm-img-preview" onError={e => e.target.style.display='none'} />
                : <div className="adm-img-placeholder">No Image</div>
              }
              <div className="adm-list-item-body">
                <div className="adm-field" style={{marginBottom:8}}>
                  <label className="adm-label">Image URL</label>
                  <input className="adm-input" value={img.url} onChange={e => updateImage(img.id, 'url', e.target.value)} placeholder="https://… or /assets/img/about/about1.png" />
                </div>
                <div className="adm-field" style={{marginBottom:0}}>
                  <label className="adm-label">Alt text</label>
                  <input className="adm-input" value={img.alt} onChange={e => updateImage(img.id, 'alt', e.target.value)} />
                </div>
              </div>
              <div className="adm-list-item-actions">
                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => removeImage(img.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="adm-section-gap" />
        <button className="adm-add-strip" onClick={addImage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Add image
        </button>
      </div>
    </div>
  );
};

export default AboutEditor;