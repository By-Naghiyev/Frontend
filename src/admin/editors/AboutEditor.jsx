import React, { useState } from 'react';
import ImageUploader from '../../components/ImageUploader';

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

  const updateImage = (id, url) => {
    const images = about.images.map(img => img.id === id ? { ...img, url } : img);
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
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label">Section Title</label>
          <input className="adm-input" value={about.title} onChange={e => update({ title: e.target.value })} />
        </div>

        <div className="adm-card-header" style={{ marginTop: 16 }}>
          <div className="adm-card-title">Paragraphs</div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addParagraph}>+ Add Paragraph</button>
        </div>

        <div className="adm-list">
          {about.paragraphs.map((para, idx) => (
            <div key={idx} className="adm-list-item">
              <div className="adm-list-item-body">
                <label className="adm-label">Paragraph {idx + 1}</label>
                <textarea className="adm-textarea" value={para} onChange={e => updateParagraph(idx, e.target.value)} />
              </div>
              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeParagraph(idx)}>Delete</button>
            </div>
          ))}
        </div>
        <button className="adm-add-strip" onClick={addParagraph}>+ Add paragraph</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Slider Images</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addImage}>+ Add Image</button>
        </div>

        <div className="adm-list">
          {about.images.map((img) => (
            <div key={img.id} className="adm-list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <ImageUploader
                currentUrl={img.url}
                onImageUploaded={(url) => updateImage(img.id, url)}
                folder="about"
                label="Image URL"
              />
              <div className="adm-field">
                <label className="adm-label">Alt text</label>
                <input className="adm-input" value={img.alt} onChange={e => updateImage(img.id, e.target.value)} />
              </div>
              <div className="adm-list-item-actions">
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeImage(img.id)}>Delete Image</button>
              </div>
            </div>
          ))}
        </div>
        <button className="adm-add-strip" onClick={addImage}>+ Add image</button>
      </div>
    </div>
  );
};

export default AboutEditor;