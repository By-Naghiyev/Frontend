import React, { useState, useEffect } from 'react';
import './admin.css';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import { fetchSiteData } from '../services/githubService';
import defaultData from '../data/site-data.json';

const AdminApp = () => {
  const [authed,  setAuthed]  = useState(() => sessionStorage.getItem('adm_auth') === '1');
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!authed) { setLoading(false); return; }
    loadData();
  }, [authed]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const d = await fetchSiteData();
      setData(d);
    } catch {
      // Fallback to bundled default data if GitHub fetch fails
      setData(defaultData);
      setError('Could not fetch live data from GitHub — loaded local fallback. Configure your .env to enable live sync.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adm_auth');
    setAuthed(false);
    setData(null);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  if (loading) {
    return (
      <div className="adm-root" style={{background:'var(--a-bg)'}}>
        <div className="adm-loading" style={{width:'100vw', height:'100vh'}}>
          <span className="adm-spinner adm-spinner-dark" style={{width:28, height:28, borderWidth:3}} />
          Loading site data…
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div style={{
          position:'fixed', top:0, left:0, right:0, zIndex:9999,
          background:'#fff3cd', color:'#856404', padding:'8px 16px',
          fontSize:12, borderBottom:'1px solid #ffc107', textAlign:'center'
        }}>
          ⚠️ {error}
        </div>
      )}
      <AdminPanel initialData={data} onLogout={handleLogout} />
    </>
  );
};

export default AdminApp;