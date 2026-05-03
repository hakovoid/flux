import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadAllArticles } from '../utils/articles';

export function GET(context: APIContext) {
  const articles = loadAllArticles().slice(0, 50);
  const siteName = process.env.SITE_NAME || 'Flux';

  return rss({
    title: `${siteName} — Veille technologique`,
    description: `Les derniers articles tech, IA, DevOps, Cloud et Cybersécurité agrégés par ${siteName}.`,
    site: context.site!,
    items: articles.map((article) => ({
      title: `${siteName} - ${article.title}`,
      pubDate: new Date(article.pubDate),
      description: article.description,
      link: `/article/${article.id}/`,
      categories: article.categories,
    })),
    customData: '<language>fr</language>',
  });
}
