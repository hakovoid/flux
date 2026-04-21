// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const env = loadEnv('', process.cwd(), '');
if (env.FLUX_ACCENT) process.env.FLUX_ACCENT = env.FLUX_ACCENT;

// https://astro.build/config
export default defineConfig({
  site: 'https://flux.yoandev.co',
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
