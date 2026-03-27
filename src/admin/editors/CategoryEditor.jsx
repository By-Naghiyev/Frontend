import React, { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';

const EMPTY_CATEGORY = () => ({
  id: `cat${Date.now()}`,
  label: '',
  icon: '',
  image: '',
});

const CategoryEditor = ({ data, onChange }) => {
  const [category, setCategory] = useState(
    data?.category || { title: 'Category', items: [] }
  );

  useEffect(() => {
    if (data?.category) setCategory(data.category);
  }, [data?.category]);

  const update = (patch) => {
    const next = { ...category, ...patch };
    setCategory(next);

    // Sync title to navbar item whose target === 'category'
    let navbar = data?.navbar || { items: [] };
    if (patch.title !== undefined) {
      const navItems = (navbar.items || []).map(item =>
        item.target === 'category' ? { ...item, label: patch.title } : item
      );
      navbar = { ...navbar, items: navItems };
    }

    onChange({ ...data, category: next, navbar });
  };

  const updateItem = (id, field, value) => {
    update({ items: (category.items || []).map(c => c.id === id ? { ...c, [field]: value } : c) });
  };

  const addItem = () => {
    const item = EMPTY_CATEGORY();
    update({ items: [...(category.items || []), item] });
  };

  const duplicateItem = (id) => {
    const src = (category.items || []).find(c => c.id === id);
    if (!src) return;
    const copy = { ...src, id: `cat${Date.now()}`, label: src.label + ' (copy)' };
    const items = [...(category.items || [])];
    const idx = items.findIndex(c => c.id === id);
    items.splice(idx + 1, 0, copy);
    update({ items });
  };

  const removeItem = (id) => update({ items: (category.items || []).filter(c => c.id !== id) });

  const moveItem = (idx, dir) => {
    const items = [...(category.items || [])];
    const swap = idx + dir;
    if (swap < 0 || swap >= items.length) return;
    [items[idx], items[swap]] = [items[swap], items[idx]];
    update({ items });
  };

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div className="adm-card-title">Section Title</div>
          <span style={{ fontSize: 11, color: 'var(--a-muted)' }}>Changing title also updates the Navbar label.</span>
        </div>
        <div className="adm-field">
          <label className="adm-label">Title</label>
          <input
            className="adm-input"
            value={category.title || ''}
            onChange={e => update({ title: e.target.value })}
          />
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Category Items ({(category.items || []).length})</div>
            <div className="adm-card-subtitle">Each item appears as a category chip / card on the site.</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addItem}>+ Add Category</button>
        </div>

        <div className="adm-list">
          {(category.items || []).map((item, idx) => (
            <div key={item.id} className="adm-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => moveItem(idx, -1)} disabled={idx === 0} style={{ padding: '2px 6px' }}>▲</button>
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => moveItem(idx, 1)}  disabled={idx === (category.items || []).length - 1} style={{ padding: '2px 6px' }}>▼</button>
                </div>
                {item.icon && <span style={{ fontSize: 24 }}>{item.icon}</span>}
                <span style={{ fontWeight: 600, flex: 1 }}>{item.label || '(unlabeled)'}</span>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => duplicateItem(item.id)}>Duplicate</button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeItem(item.id)}>Delete</button>
              </div>

              {/* Fields */}
              <div className="adm-row">
                <div className="adm-field">
                  <label className="adm-label">Label (display name)</label>
                  <input className="adm-input" value={item.label || ''} onChange={e => updateItem(item.id, 'label', e.target.value)} placeholder="e.g. Candles" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Icon / Emoji (optional)</label>
                  <input className="adm-input" value={item.icon || ''} onChange={e => updateItem(item.id, 'icon', e.target.value)} placeholder="🕯️" style={{ fontSize: 18 }} />
                </div>
              </div>

              <ImageUploader
                currentUrl={item.image}
                onImageUploaded={(url) => updateItem(item.id, 'image', url)}
                folder="category"
                label="Category Image (optional)"
              />
            </div>
          ))}
        </div>

        <button className="adm-add-strip" onClick={addItem}>+ Add category item</button>
      </div>

      {/* Preview */}
      {(category.items || []).length > 0 && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div className="adm-card-title">Preview</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '8px 0' }}>
            {(category.items || []).map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 20,
                background: 'var(--a-lime)', border: '1px solid var(--a-border)',
                fontSize: 13, fontWeight: 600, color: 'var(--a-green)',
              }}>
                {item.icon && <span style={{ fontSize: 16 }}>{item.icon}</span>}
                {item.label || '(empty)'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEditor;