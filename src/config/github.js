// config/github.js
export const GITHUB_CONFIG = {
  owner:    import.meta.env.VITE_GITHUB_OWNER   || "kenanmusali",
  repo:     import.meta.env.VITE_GITHUB_REPO    || "bynaghiyev",
  branch:   import.meta.env.VITE_GITHUB_BRANCH  || "main",
  dataFile: import.meta.env.VITE_GITHUB_DATA_PATH || "src/data/site-data.json",
  token:    import.meta.env.VITE_GITHUB_TOKEN   || "",
};

export const ADMIN_CREDENTIALS = {
  email:    import.meta.env.VITE_ADMIN_EMAIL    || "admin@bynaghiyev.com",
  password: import.meta.env.VITE_ADMIN_PASSWORD || "Hello1234",
};