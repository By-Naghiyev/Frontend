import React, { useState } from 'react';

const EMPTY_BLOG = () => ({
  id: `b${Date.now()}`,
  title: '',
  description: '',
  body: '',
  image: '',
  images: [],
});

const BlogsEditor = ({ data, onChange }) => {
  const [blogs, setBlogs]       = useState(data.blogs);
  const [expanded, setExpanded] = useState({});

  const update = (patch) => {
    const next = { ...blogs, ...patch };
    setBlogs(next);
    onChange({ ...data, blogs: next });
  };

  const updateItem = (id, field, value) => {
    update({ items: blogs.items.map(b => b.id === id ? { ...b, [field]: value } : b) });
  };

  const addExtraImage = (id) => {
    const item = blogs.items.find(b => b.id === id);
    const images = [...(item.images || []), { id: `bi${Date.now()}`, url: '', alt: '' }];
    updateItem(id, 'images', images);
  };
  const updateExtraImage = (blogId, imgId, field, value) => {
    const item = blogs.items.find(b => b.id === blogId);
    const images = (item.images || []).map(img => img.id === imgId ? { ...img, [field]: value } : img);
    updateItem(blogId, 'images', images);
  };
  const removeExtraImage = (blogId, imgId) => {
    const item = blogs.items.find(b => b.id === blogId);
    updateItem(blogId, 'images', (item.images || []).filter(img => img.id !== imgId));
  };

  const addItem = () => {
    const item = EMPTY_BLOG();
    update({ items: [...blogs.items, item] });
    setExpanded(e => ({ ...e, [item.id]: true }));
  };
  const duplicateItem = (id) => {
    const src  = blogs.items.find(b => b.id === id);
    const copy = { ...src, id: `b${Date.now()}`, title: src.title + ' (copy)', images: [...(src.images || [])] };
    const idx  = blogs.items.findIndex(b => b.id === id);
    const items = [...blogs.items];
    items.splice(idx + 1, 0, copy);
    update({ items });
    setExpanded(e => ({ ...e, [copy.id]: true }));
  };
  const removeItem = (id)  => update({ items: blogs.items.filter(b => b.id !== id) });
  const toggle     = (id)  => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <div>
      {/* Section title */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div><div className="adm-card-title">Section Title</div></div>
        </div>
        <div className="adm-field">
          <label className="adm-label">Title</label>
          <input className="adm-input" value={blogs.title}
            onChange={e => update({ title: e.target.value })} placeholder="Blogs" />
        </div>
      </div>

      {/* Posts */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Blog Posts ({blogs.items.length})</div>
            <div className="adm-card-subtitle">Click a post to expand and edit all fields</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addItem}>+ Add Post</button>
        </div>

        <div className="adm-items-grid">
          {blogs.items.map((item) => (
            <div key={item.id} className="adm-item-card">
              <div className="adm-item-card-header" onClick={() => toggle(item.id)}>
                {item.image
                  ? <img src={item.image} alt={item.title} className="adm-img-preview"
                         style={{width:44,height:44}} onError={e => e.target.style.display='none'} />
                  : <div className="adm-img-placeholder" style={{width:44,height:44,fontSize:9}}>IMG</div>
                }
                <span className="adm-item-card-title">{item.title || '(untitled post)'}</span>
                <span style={{fontSize:12,color:'var(--a-muted)'}}>{expanded[item.id] ? '▲' : '▼'}</span>
                <button className="adm-btn adm-btn-ghost adm-btn-sm"
                  onClick={e => { e.stopPropagation(); duplicateItem(item.id); }} title="Duplicate">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon"
                  onClick={e => { e.stopPropagation(); removeItem(item.id); }} title="Delete">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>

              <div className={`adm-item-card-body ${expanded[item.id] ? '' : 'collapsed'}`}>
                <div className="adm-field">
                  <label className="adm-label">Post Title</label>
                  <input className="adm-input" value={item.title}
                    onChange={e => updateItem(item.id, 'title', e.target.value)} placeholder="Blog Post Title" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Short Description (shown on card)</label>
                  <input className="adm-input" value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                    placeholder="One-line summary shown on the slider card" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Full Body Text (shown when reader opens the post — blank lines = new paragraph)</label>
                  <textarea className="adm-textarea" value={item.body || ''}
                    onChange={e => updateItem(item.id, 'body', e.target.value)}
                    placeholder={"Write the full article here...\n\nUse blank lines between paragraphs."}
                    style={{minHeight:140}} />
                </div>

                {/* Cover image */}
                <div className="adm-divider" />
                <div style={{fontWeight:700,fontSize:13,color:'var(--a-text)',marginBottom:10}}>Cover Image</div>
                <div className="adm-field">
                  <label className="adm-label">Cover Image URL</label>
                  <input className="adm-input" value={item.image}
                    onChange={e => updateItem(item.id, 'image', e.target.value)}
                    placeholder="https://… or /assets/img/blogs/blogs1.png" />
                </div>
                {item.image && (
                  <img src={item.image} alt="preview"
                    style={{maxWidth:220,borderRadius:8,border:'1.5px solid var(--a-border)',marginBottom:8}}
                    onError={e => e.target.style.display='none'} />
                )}

                {/* Detail slider images */}
                <div className="adm-divider" />
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:'var(--a-text)'}}>Detail Slider Images</div>
                    <div style={{fontSize:11,color:'var(--a-muted)',marginTop:2}}>
                      Additional images in the expanded popup slider. Leave empty to reuse cover image.
                    </div>
                  </div>
                  <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => addExtraImage(item.id)}>+ Add</button>
                </div>
                <div className="adm-list">
                  {(item.images || []).map(img => (
                    <div key={img.id} className="adm-list-item">
                      {img.url
                        ? <img src={img.url} alt={img.alt} className="adm-img-preview"
                               onError={e => e.target.style.display='none'} />
                        : <div className="adm-img-placeholder">No URL</div>
                      }
                      <div className="adm-list-item-body">
                        <div className="adm-field" style={{marginBottom:6}}>
                          <label className="adm-label">URL</label>
                          <input className="adm-input" value={img.url}
                            onChange={e => updateExtraImage(item.id, img.id, 'url', e.target.value)}
                            placeholder="https://…" />
                        </div>
                        <div className="adm-field" style={{marginBottom:0}}>
                          <label className="adm-label">Alt text</label>
                          <input className="adm-input" value={img.alt}
                            onChange={e => updateExtraImage(item.id, img.id, 'alt', e.target.value)} />
                        </div>
                      </div>
                      <div className="adm-list-item-actions">
                        <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon"
                          onClick={() => removeExtraImage(item.id, img.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {(!item.images || item.images.length === 0) && (
                  <button className="adm-add-strip" onClick={() => addExtraImage(item.id)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Add slider image
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="adm-section-gap" />
        <button className="adm-add-strip" onClick={addItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add blog post
        </button>
      </div>
    </div>
  );
};

export default BlogsEditor;