// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const env = loadEnv('', process.cwd(), '');
if (env.FLUX_ACCENT) process.env.FLUX_ACCENT = env.FLUX_ACCENT;
if (env.UMAMI_WEBSITE_ID) process.env.UMAMI_WEBSITE_ID = env.UMAMI_WEBSITE_ID;
if (env.GITHUB_REPO_URL) process.env.GITHUB_REPO_URL = env.GITHUB_REPO_URL;

// https://astro.build/config
export default defineConfig({
  site: env.SITE_URL || 'https://your-flux-site.example.com',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/page/') && !page.includes('/rs'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
