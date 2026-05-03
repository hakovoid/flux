import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadAiArticles } from '../../utils/articles';

export function GET(context: APIContext) {
  const articles = loadAiArticles().slice(0, 50);
  const siteName = process.env.SITE_NAME || 'Flux';

  return rss({
    title: `${siteName} — AI Labs Watch`,
    description: `Latest announcements from major AI labs (OpenAI, Anthropic, Google DeepMind, Mistral, Hugging Face…) aggregated by ${siteName}.`,
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
