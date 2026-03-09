export interface FeedConfig {
  url: string;
  name: string;
  categories: string[];
}

export interface FeedsConfig {
  feeds: FeedConfig[];
}

export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  categories: string[];
  image: string | null;
}

export interface MonthlyData {
  month: string;
  articles: Article[];
}
