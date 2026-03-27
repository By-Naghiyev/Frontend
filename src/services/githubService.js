import { GITHUB_CONFIG } from '../config/github';

const BASE = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;

// ─── READ ────────────────────────────────────────────────────────────────────
export const fetchSiteData = async () => {
  const raw = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.dataFile}?t=${Date.now()}`;
  const res = await fetch(raw);
  if (!res.ok) throw new Error(`Failed to load site data (${res.status})`);
  return res.json();
};

// ─── LIST IMAGES FROM REPO ───────────────────────────────────────────────────
let _imageCache = null;
let _imageCacheTs = 0;
const IMAGE_CACHE_TTL = 60 * 1000; // 1 min

export const listRepoImages = async () => {
  // Return cache if fresh
  if (_imageCache && Date.now() - _imageCacheTs < IMAGE_CACHE_TTL) return _imageCache;

  if (!GITHUB_CONFIG.token) {
    // No token: return static fallback list from known paths
    return getStaticImageList();
  }

  try {
    const res = await fetch(
      `${BASE}/git/trees/${GITHUB_CONFIG.branch}?recursive=1`,
      { headers: { Authorization: `token ${GITHUB_CONFIG.token}` } }
    );
    if (!res.ok) return getStaticImageList();
    const { tree } = await res.json();
    const images = tree
      .filter(f =>
        f.type === 'blob' &&
        f.path.startsWith('public/assets/img/') &&
        /\.(png|jpe?g|gif|webp|svg)$/i.test(f.path)
      )
      .map(f => {
        const parts = f.path.split('/'); // ['public','assets','img','folder','file.png']
        const folder = parts.length >= 5 ? parts[parts.length - 2] : 'other';
        const name = parts[parts.length - 1];
        return {
          path: f.path,
          localUrl: '/' + f.path.replace(/^public\//, ''),   // /assets/img/…
          rawUrl: `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${f.path}`,
          folder,
          name,
        };
      });
    _imageCache = images;
    _imageCacheTs = Date.now();
    return images;
  } catch {
    return getStaticImageList();
  }
};

export const invalidateImageCache = () => { _imageCache = null; };

const getStaticImageList = () => [
  { path: 'public/assets/img/header/header1.png', localUrl: '/assets/img/header/header1.png', rawUrl: '/assets/img/header/header1.png', folder: 'header', name: 'header1.png' },
  { path: 'public/assets/img/header/header2.png', localUrl: '/assets/img/header/header2.png', rawUrl: '/assets/img/header/header2.png', folder: 'header', name: 'header2.png' },
  { path: 'public/assets/img/about/about1.png',   localUrl: '/assets/img/about/about1.png',   rawUrl: '/assets/img/about/about1.png',   folder: 'about',  name: 'about1.png'  },
  { path: 'public/assets/img/about/about2.png',   localUrl: '/assets/img/about/about2.png',   rawUrl: '/assets/img/about/about2.png',   folder: 'about',  name: 'about2.png'  },
  { path: 'public/assets/img/about/about3.png',   localUrl: '/assets/img/about/about3.png',   rawUrl: '/assets/img/about/about3.png',   folder: 'about',  name: 'about3.png'  },
  { path: 'public/assets/img/product/product1.png', localUrl: '/assets/img/product/product1.png', rawUrl: '/assets/img/product/product1.png', folder: 'product', name: 'product1.png' },
  { path: 'public/assets/img/blogs/blogs1.png',   localUrl: '/assets/img/blogs/blogs1.png',   rawUrl: '/assets/img/blogs/blogs1.png',   folder: 'blogs',  name: 'blogs1.png'  },
];

// ─── UPLOAD IMAGE TO GITHUB ──────────────────────────────────────────────────
export const uploadImage = async (file, folder) => {
  if (!GITHUB_CONFIG.token) throw new Error('GitHub token is not configured.');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
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

        // Invalidate cache so new image appears in gallery
        invalidateImageCache();

        // Return the local /assets path (works after Vite build / deploy)
        resolve(`/assets/img/${folder}/${filename}`);
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