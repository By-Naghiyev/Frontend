import { GITHUB_CONFIG } from '../config/github';

const BASE = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;

// ─── READ ────────────────────────────────────────────────────────────────────
export const fetchSiteData = async () => {
  const raw = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.dataFile}?t=${Date.now()}`;
  const res = await fetch(raw);
  if (!res.ok) throw new Error(`Failed to load site data (${res.status})`);
  return res.json();
};

// ─── UPLOAD IMAGE TO GITHUB ─────────────────────────────────────────────────
export const uploadImage = async (file, folder) => {
  if (!GITHUB_CONFIG.token) throw new Error('GitHub token is not configured.');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      const filename = `${Date.now()}-${file.name}`;
      const path = `public/assets/img/${folder}/${filename}`;

      try {
        const putRes = await fetch(`${BASE}/contents/${path}`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${GITHUB_CONFIG.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Upload image: ${filename}`,
            content: base64,
            branch: GITHUB_CONFIG.branch,
          }),
        });

        if (!putRes.ok) {
          const err = await putRes.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to upload image.');
        }

        resolve(`https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${path}`);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// ─── WRITE ───────────────────────────────────────────────────────────────────
export const saveSiteData = async (data) => {
  if (!GITHUB_CONFIG.token) throw new Error('GitHub token is not configured.');

  const metaRes = await fetch(
    `${BASE}/contents/${GITHUB_CONFIG.dataFile}?ref=${GITHUB_CONFIG.branch}`,
    { headers: { Authorization: `token ${GITHUB_CONFIG.token}` } }
  );
  if (!metaRes.ok) throw new Error('Could not read file metadata from GitHub.');
  const meta = await metaRes.json();

  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  const putRes = await fetch(`${BASE}/contents/${GITHUB_CONFIG.dataFile}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `chore: update site data via admin panel [${new Date().toISOString()}]`,
      content,
      sha: meta.sha,
      branch: GITHUB_CONFIG.branch,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save to GitHub.');
  }
  return putRes.json();
};