import React, { useState } from 'react';

const EMPTY_PRODUCT = () => ({
  id: `p${Date.now()}`,
  name: '',
  description: '',
  image: '',
  instagramUrl: 'https://www.instagram.com',
  ebayUrl: 'https://www.ebay.com',
});

const ProductsEditor = ({ data, onChange }) => {
  const [products, setProducts]   = useState(data.products);
  const [expanded, setExpanded]   = useState({});

  const update = (patch) => {
    const next = { ...products, ...patch };
    setProducts(next);
    onChange({ ...data, products: next });
  };

  const updateItem = (id, field, value) => {
    update({ items: products.items.map(p => p.id === id ? { ...p, [field]: value } : p) });
  };

  const addItem = () => {
    const item = EMPTY_PRODUCT();
    update({ items: [...products.items, item] });
    setExpanded(e => ({ ...e, [item.id]: true }));
  };

  const duplicateItem = (id) => {
    const src = products.items.find(p => p.id === id);
    const copy = { ...src, id: `p${Date.now()}`, name: src.name + ' (copy)' };
    const idx = products.items.findIndex(p => p.id === id);
    const items = [...products.items];
    items.splice(idx + 1, 0, copy);
    update({ items });
    setExpanded(e => ({ ...e, [copy.id]: true }));
  };

  const removeItem = (id) => update({ items: products.items.filter(p => p.id !== id) });

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Section Title</div>
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label">Title</label>
          <input
            className="adm-input"
            value={products.title}
            onChange={e => update({ title: e.target.value })}
            placeholder="Products"
          />
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Products ({products.items.length})</div>
            <div className="adm-card-subtitle">Click a product to expand and edit</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addItem}>+ Add Product</button>
        </div>

        <div className="adm-items-grid">
          {products.items.map((item) => (
            <div key={item.id} className="adm-item-card">
              <div className="adm-item-card-header" onClick={() => toggle(item.id)}>
                {item.image
                  ? <img src={item.image} alt={item.name} className="adm-img-preview" style={{width:44,height:44}} onError={e => e.target.style.display='none'} />
                  : <div className="adm-img-placeholder" style={{width:44,height:44,fontSize:9}}>IMG</div>
                }
                <span className="adm-item-card-title">{item.name || '(unnamed product)'}</span>
                <span style={{fontSize:12, color:'var(--a-muted)'}}>{expanded[item.id] ? '▲' : '▼'}</span>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={e => { e.stopPropagation(); duplicateItem(item.id); }} title="Duplicate">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                </button>
                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={e => { e.stopPropagation(); removeItem(item.id); }} title="Delete">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>

              <div className={`adm-item-card-body ${expanded[item.id] ? '' : 'collapsed'}`}>
                <div className="adm-row">
                  <div className="adm-field">
                    <label className="adm-label">Product Name</label>
                    <input className="adm-input" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder="Scented Candle" />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">Description</label>
                    <input className="adm-input" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Natural Waxes & Essential Oils" />
                  </div>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Image URL</label>
                  <input className="adm-input" value={item.image} onChange={e => updateItem(item.id, 'image', e.target.value)} placeholder="https://… or /assets/img/product/product1.png" />
                </div>
                <div className="adm-row">
                  <div className="adm-field">
                    <label className="adm-label">Instagram Order URL</label>
                    <input className="adm-input" value={item.instagramUrl} onChange={e => updateItem(item.id, 'instagramUrl', e.target.value)} placeholder="https://instagram.com/…" />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">eBay Order URL</label>
                    <input className="adm-input" value={item.ebayUrl} onChange={e => updateItem(item.id, 'ebayUrl', e.target.value)} placeholder="https://ebay.com/…" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="adm-section-gap" />
        <button className="adm-add-strip" onClick={addItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Add product
        </button>
      </div>
    </div>
  );
};

export default ProductsEditor;