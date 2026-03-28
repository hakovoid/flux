/**
 * Script one-shot : re-fetche les flux RSS/YouTube et met à jour
 * les descriptions existantes avec la nouvelle limite de 500 chars.
 * Les IDs et URLs ne changent pas.
 *
 * Usage : npx tsx --env-file-if-exists=.env scripts/migrate-descriptions.ts
 */

import RSSParser from 'rss-parser';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { parse } from 'yaml';
import { createHash } from 'crypto';
import type { FeedsConfig, MonthlyData } from '../src/types/index.ts';

const DATA_DIR = 'data';
const FEEDS_FILE = 'feeds.yaml';
const CONCURRENCY = 5;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const parser = new RSSParser({
  timeout: 10000,
  headers: {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  },
});

function generateId(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 12);
}

function truncateDescription(text: string | undefined, maxLength = 500): string {
  if (!text) return '';
  const clean = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function resolveUrl(url: string, baseUrl: string): string {
  if (isAbsoluteUrl(url)) return url;
  try {
    if (!isAbsoluteUrl(baseUrl)) return url;
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

// --- Load all existing data ---
function loadAllData(): Map<string, MonthlyData> {
  const dataMap = new Map<string, MonthlyData>();
  if (!existsSync(DATA_DIR)) return dataMap;
  for (const file of readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))) {
    try {
      const data: MonthlyData = JSON.parse(readFileSync(`${DATA_DIR}/${file}`, 'utf-8'));
      dataMap.set(file, data);
    } catch { /* skip */ }
  }
  return dataMap;
}

// --- Build a lookup: article ID → { file, index } ---
function buildArticleIndex(dataMap: Map<string, MonthlyData>): Map<string, { file: string; index: number }> {
  const index = new Map<string, { file: string; index: number }>();
  for (const [file, data] of dataMap) {
    data.articles.forEach((a, i) => index.set(a.id, { file, index: i }));
  }
  return index;
}

// --- Fetch descriptions from feeds ---
async function fetchDescriptions(config: FeedsConfig): Promise<Map<string, string>> {
  const descriptions = new Map<string, string>();

  async function processFeed(feedConfig: FeedsConfig['feeds'][number]): Promise<void> {
    const feedType = feedConfig.type || 'blog';

    if (feedType === 'youtube') {
      if (!YOUTUBE_API_KEY) return;
      try {
        const uploadsPlaylistId = 'UU' + feedConfig.url.slice(2);
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) return;
        const data = await response.json();
        for (const item of data.items || []) {
          const videoId = item.snippet.resourceId.videoId;
          const link = `https://www.youtube.com/watch?v=${videoId}`;
          const id = generateId(link);
          const rawDesc = item.snippet.description || `Vidéo YouTube publiée par ${feedConfig.name} — ${item.snippet.title}`;
          descriptions.set(id, truncateDescription(rawDesc));
        }
        console.log(`  ✓ YouTube ${feedConfig.name}: ${(data.items || []).length} vidéos`);
      } catch (err: any) {
        console.log(`  ✗ YouTube ${feedConfig.name}: ${err.message}`);
      }
      return;
    }

    // RSS/Atom with retry (same logic as fetch-feeds.ts)
    let feed: RSSParser.Output<RSSParser.Item> | null = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        if (attempt === 1) {
          feed = await parser.parseURL(feedConfig.url);
        } else {
          const response = await fetch(feedConfig.url, {
            headers: {
              'User-Agent': USER_AGENT,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            signal: AbortSignal.timeout(10000),
          });
          if (!response.ok) throw new Error(`Status ${response.status}`);
          let text = await response.text();
          text = text.replace(/^\uFEFF/, '').replace(/^[\s\S]*?(<\?xml)/, '$1');
          feed = await parser.parseString(text);
        }
        break;
      } catch (err: any) {
        if (attempt < 2) continue;
        console.log(`  ✗ ${feedConfig.name}: ${err.message}`);
        return;
      }
    }

    if (feed) {
      for (const item of feed.items || []) {
        const rawLink = item.link;
        if (!rawLink) continue;
        const baseUrl = (feed.link && isAbsoluteUrl(feed.link)) ? feed.link : feedConfig.url;
        const link = resolveUrl(rawLink, baseUrl);
        const id = generateId(link);
        descriptions.set(id, truncateDescription(item.contentSnippet || item.content || item.summary));
      }
      console.log(`  ✓ ${feedConfig.name}: ${(feed.items || []).length} articles`);
    }
  }

  // Process feeds in parallel batches
  for (let i = 0; i < config.feeds.length; i += CONCURRENCY) {
    const batch = config.feeds.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(processFeed));
  }

  return descriptions;
}

// --- Main ---
async function main() {
  console.log('📦 Chargement des données existantes...');
  const dataMap = loadAllData();
  const articleIndex = buildArticleIndex(dataMap);
  const totalArticles = articleIndex.size;
  console.log(`   ${totalArticles} articles en base\n`);

  console.log('📡 Récupération des flux pour mettre à jour les descriptions...\n');
  const config: FeedsConfig = parse(readFileSync(FEEDS_FILE, 'utf-8'));
  const freshDescriptions = await fetchDescriptions(config);
  console.log(`\n📝 ${freshDescriptions.size} descriptions récupérées depuis les flux\n`);

  // Update descriptions
  let updated = 0;
  let skipped = 0;
  const modifiedFiles = new Set<string>();

  for (const [id, newDesc] of freshDescriptions) {
    const loc = articleIndex.get(id);
    if (!loc) { skipped++; continue; }

    const data = dataMap.get(loc.file)!;
    const article = data.articles[loc.index];
    if (article.description === newDesc) continue;

    article.description = newDesc;
    modifiedFiles.add(loc.file);
    updated++;
  }

  // Write modified files
  for (const file of modifiedFiles) {
    const data = dataMap.get(file)!;
    writeFileSync(`${DATA_DIR}/${file}`, JSON.stringify(data, null, 2) + '\n');
  }

  console.log(`✅ Migration terminée :`);
  console.log(`   ${updated} descriptions mises à jour`);
  console.log(`   ${skipped} articles non trouvés en base (nouveaux dans les flux)`);
  console.log(`   ${modifiedFiles.size} fichier(s) modifié(s)`);

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
