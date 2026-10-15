import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

if (site) {
  const url = new URL(site);
  if (url.protocol !== 'https:' || url.origin !== site.replace(/\/$/, '')) {
    throw new Error('SITE_URL must be an HTTPS origin; set its path separately with BASE_PATH.');
  }
}
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
  throw new Error('BASE_PATH must start and end with /, for example / or /cv/.');
}

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});
