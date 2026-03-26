import React, { useState } from 'react';

const NavbarEditor = ({ data, onChange }) => {
  const [items, setItems] = useState(data.navbar.items || []);

  const update = (newItems) => {
    setItems(newItems);
    onChange({ ...data, navbar: { ...data.navbar, items: newItems } });
  };

  const addItem = () => {
    const newItem = { id: `n${Date.now()}`, label: 'New Link', target: 'section-id' };
    update([...items, newItem]);
  };

  const removeItem = (id) => update(items.filter(i => i.id !== id));

  const editItem = (id, field, value) => {
    update(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Navigation Items</div>
            <div className="adm-card-subtitle">Add, rename, or remove navbar links</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addItem}>
            + Add Link
          </button>
        </div>

        <div className="adm-list">
          {items.map((item, idx) => (
            <div key={item.id} className="adm-list-item">
              <div className="adm-drag-handle" title="Drag to reorder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </div>
              <div className="adm-list-item-body">
                <div className="adm-row">
                  <div className="adm-field">
                    <label className="adm-label">Label (display text)</label>
                    <input
                      className="adm-input"
                      value={item.label}
                      onChange={e => editItem(item.id, 'label', e.target.value)}
                      placeholder="e.g. About us"
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">Section ID (scroll target)</label>
                    <input
                      className="adm-input"
                      value={item.target}
                      onChange={e => editItem(item.id, 'target', e.target.value)}
                      placeholder="e.g. about"
                    />
                  </div>
                </div>
              </div>
              <div className="adm-list-item-actions">
                <button
                  className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon"
                  onClick={() => removeItem(item.id)}
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="adm-section-gap" />
        <button className="adm-add-strip" onClick={addItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add navigation link
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Preview</div>
            <div className="adm-card-subtitle">How the navbar links look</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'24px', flexWrap:'wrap', padding:'12px 0' }}>
          {items.map(i => (
            <span key={i.id} style={{
              padding:'6px 14px', borderRadius:'20px',
              background:'#1F4A44', color:'white',
              fontSize:'13px', fontWeight:600
            }}>
              {i.label || '(empty)'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarEditor;