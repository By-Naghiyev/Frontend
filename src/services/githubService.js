import { GITHUB_CONFIG } from '../config/github';

const BASE = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;

// ─── READ ────────────────────────────────────────────────────────────────────
export const fetchSiteData = async () => {
  // Always bypass the CDN cache with a timestamp query
  const raw = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.dataFile}?t=${Date.now()}`;
  const res = await fetch(raw);
  if (!res.ok) throw new Error(`Failed to load site data (${res.status})`);
  return res.json();
};

// ─── WRITE ───────────────────────────────────────────────────────────────────
export const saveSiteData = async (data) => {
  if (!GITHUB_CONFIG.token) throw new Error('GitHub token is not configured.');

  // 1. Get current file SHA (required for update)
  const metaRes = await fetch(
    `${BASE}/contents/${GITHUB_CONFIG.dataFile}?ref=${GITHUB_CONFIG.branch}`,
    { headers: { Authorization: `token ${GITHUB_CONFIG.token}` } }
  );
  if (!metaRes.ok) throw new Error('Could not read file metadata from GitHub.');
  const meta = await metaRes.json();

  // 2. PUT updated content
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