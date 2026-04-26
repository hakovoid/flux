# Flux

Agrégateur de veille technologique RSS et YouTube. Un site statique construit avec Astro et Tailwind CSS, mis à jour automatiquement chaque matin via GitHub Actions.

## Fonctionnalités

### Agrégation
- Agrégation automatique de flux RSS, podcasts et chaînes YouTube (cron quotidien à 4h UTC)
- Deux collections : articles francophones (`/`) et internationaux (`/world`)
- Déduplication par hash SHA256 de l'URL
- Extraction d'image en cascade : balises RSS (`media:content`, `enclosure`, `itunes:image`…) → fallback `og:image` / `twitter:image` → image de repli par source (`fallbackImage` dans `feeds.yaml`)

### Navigation & découverte
- Recherche full-text côté client (Fuse.js)
- **Trois vues d'affichage** : cartes, liste, liste compacte (toggle persisté en localStorage)
- Filtres combinables : catégorie, source, type (article / podcast / YouTube), plage de dates avec presets (7j / 30j / mois en cours)
- Panneau de filtres pliable (état mémorisé)
- Pagination (15 articles/page)
- Pages dédiées par **catégorie** (`/categorie/[slug]`) et par **source** (`/source/[slug]`)
- Page liste de toutes les sources
- Articles similaires en bas de chaque page article

### Interactions utilisateur (localStorage, sans compte)
- **Favoris** : page dédiée `/favoris`
- **À lire plus tard** : page dédiée `/a-lire-plus-tard`
- Marquage automatique des articles non lus depuis la dernière visite
- Indicateurs de fraîcheur (Nouveau / Récent)

### Lecture
- Pages article dédiées avec lecteur audio intégré pour les podcasts et lecteur embarqué pour les vidéos YouTube
- Flux RSS sortant (`/rss.xml`, `/world/rss.xml`) pour s'abonner

### Theming & UX
- Dark mode par défaut + thème clair
- Couleur d'accent configurable au build via `FLUX_ACCENT` (`indigo`, `violet`, `emerald`, `green`, `rose`, `amber`, `orange`, `red`)
- Mobile first, View Transitions (Astro)
- SEO : meta, Open Graph, sitemap, robots.txt, canonical vers la source originale

## Stack

- [Astro](https://astro.build) — Framework web statique
- [Tailwind CSS v4](https://tailwindcss.com) — Styles
- [Fuse.js](https://www.fusejs.io) — Recherche côté client
- [rss-parser](https://github.com/rbren/rss-parser) — Parsing des flux RSS
- [YouTube Data API v3](https://developers.google.com/youtube/v3) — Récupération des vidéos YouTube
- GitHub Actions — Automatisation
- Netlify — Hébergement

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Récupérer les flux RSS (première fois)
npm run fetch-feeds

# Lancer le serveur de dev
npm run dev
```

Le site sera disponible sur `http://localhost:4321`.

## Ajouter un flux RSS

Modifier le fichier `feeds.yaml` à la racine du projet. Deux collections sont disponibles :
- `feeds:` pour les sources francophones (rendues sur `/`)
- `feeds_world:` pour les sources internationales (rendues sur `/world`)

```yaml
feeds:
  # Blog / RSS classique
  - url: https://example.com/feed.xml
    name: Mon Blog
    categories: [Programmation, Web]

  # Podcast
  - url: https://example.com/podcast/feed.xml
    name: Mon Podcast
    type: podcast
    categories: [Programmation]

  # Chaîne YouTube (url = channel ID)
  - url: UCxxxxxxxxxxxxxxxxxxxxxxxx
    name: Ma Chaîne (YouTube)
    type: youtube
    categories: [Programmation, IA]

  # Source avec image de repli (utilisée si le RSS et og:image ne donnent rien)
  - url: https://example.com/feed.xml
    name: Source Sans Image
    categories: [Web]
    fallbackImage: https://example.com/logo.png

feeds_world:
  - url: https://example.org/feed.xml
    name: International Example
    categories: [IA]
```

Catégories disponibles : `Programmation`, `IA`, `DevOps`, `Cybersécurité`, `Cloud`, `Web`.

Vous pouvez en ajouter de nouvelles, elles seront automatiquement prises en compte.

### Image de repli par source

Certaines sources n'exposent pas d'image dans leur flux RSS et bloquent le scraping `og:image` (Cloudflare, blogs minimalistes…). Le champ optionnel `fallbackImage` définit une URL utilisée quand aucune autre source d'image n'a fonctionné. Le fallback est ré-appliqué rétroactivement aux articles déjà en base à chaque `npm run fetch-feeds`.

## Configuration YouTube

Pour récupérer les vidéos YouTube, une clé API Google est nécessaire :

1. Créer un projet dans la [Google Cloud Console](https://console.cloud.google.com/)
2. Activer l'API "YouTube Data API v3"
3. Créer une clé API (Credentials > API Key)

**En local :** créer un fichier `.env` à la racine :
```
YOUTUBE_API_KEY=votre_clé_ici
```

**En CI :** ajouter le secret `YOUTUBE_API_KEY` dans Settings > Secrets and variables > Actions du repo GitHub.

## Personnaliser la couleur d'accent

La couleur d'accent du site est contrôlée au build via la variable d'environnement `FLUX_ACCENT`.

Valeurs disponibles : `indigo` (défaut), `violet`, `emerald`, `green`, `rose`, `amber`, `orange`, `red`.

```bash
FLUX_ACCENT=emerald npm run build
```

Les teintes sont définies dans `src/config/theme.ts` et injectées sous forme de variables CSS (`--color-accent-*`). Toute l'UI utilise ces tokens, donc changer la valeur suffit à re-thémer l'ensemble du site.

## Structure du projet

```
├── feeds.yaml              # Configuration des flux RSS (feeds / feeds_world)
├── data/                   # Articles francophones (JSON mensuel, auto-généré)
├── data-world/             # Articles internationaux (JSON mensuel, auto-généré)
├── scripts/
│   └── fetch-feeds.ts      # Script de récupération RSS + enrichissement og:image + fallback
├── src/
│   ├── components/         # ArticleCard, ArticleListItem, ArticleListItemCompact, CategoryFilter…
│   ├── config/theme.ts     # Palettes d'accent (FLUX_ACCENT)
│   ├── layouts/            # Layout principal
│   ├── pages/              # Pages : index, pagination, article, sources, source/[slug],
│   │                       # categorie/[slug], favoris, a-lire-plus-tard, a-propos, world/…
│   ├── styles/             # CSS global
│   ├── types/              # Types TypeScript (FeedConfig, Article…)
│   └── utils/              # Utilitaires (articles, userLists pour favoris/à lire plus tard)
├── .github/workflows/      # GitHub Actions
├── netlify.toml            # Config Netlify
└── astro.config.mjs        # Config Astro (+ plugin d'injection de l'accent)
```

## Commandes

| Commande | Action |
|:--|:--|
| `npm install` | Installer les dépendances |
| `npm run dev` | Serveur de dev (`localhost:4321`) |
| `npm run build` | Build de production (`./dist/`) |
| `npm run preview` | Prévisualiser le build |
| `npm run fetch-feeds` | Récupérer les flux RSS |

## Déploiement

- **Hébergement** : Netlify, URL : https://hakovoid-flux.netlify.app
- **Auto-deploy** : push sur `main` → Netlify rebuild (~2 min)
- **Cron** : `.github/workflows/fetch-feeds.yml` tourne chaque jour à 04:00 UTC, commit les nouveaux articles, ce qui redéclenche le rebuild Netlify

⚠️ **Note quota Netlify free** : depuis le passage au modèle 300 crédits/mois (≈ 20 deploys/mois), un cron quotidien + dev actif sature vite. Plan de migration vers Cloudflare Pages disponible dans `~/kuro_apps/_second-brain/apps/hakomini/flux-daybrief/migration-netlify-vers-cloudflare.md`.

## Intégration DayBrief

Le RSS publié par Flux est consommé par [DayBrief](https://github.com/hakovoid/daybrief), une newsletter quotidienne IA :

```
Flux         → publie /rss.xml et /world/rss.xml
DayBrief     → lit ces flux à 05:00 UTC, résume avec Gemini, envoie un email
```

Aucune dépendance directe : DayBrief consomme le RSS comme n'importe quel agrégateur. Ils sont totalement découplés.

## Documentation interne

Les notes opérationnelles (déploiement, dépannage, migration, suggestions d'évolution) sont dans `~/kuro_apps/_second-brain/apps/hakomini/flux-daybrief/` :

- `STATUS.md` — état courant + TODO
- `flux-et-daybrief-deploiement.md` — tuto complet
- `migration-netlify-vers-cloudflare.md` — plan de migration

Suggestions d'évolution dans `.claude/_docs/SUGGESTIONS.md` (36 idées classées par effort/valeur).

## Licence

MIT
