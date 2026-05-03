import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadWorldArticles } from '../../utils/articles';

export function GET(context: APIContext) {
  const articles = loadWorldArticles().slice(0, 50);
  const siteName = process.env.SITE_NAME || 'Flux';

  return rss({
    title: `${siteName} — World Tech Watch`,
    description: `Latest international tech articles aggregated by ${siteName}.`,
    site: context.site!,
    items: articles.map((article) => ({
      title: `${siteName} - ${article.title}`,
      pubDate: new Date(article.pubDate),
      description: article.description,
      link: `/article/${article.id}/`,
      categories: article.categories,
    })),
    customData: '<language>en</language>',
  });
}
