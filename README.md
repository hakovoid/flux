# Flux

> Agrégateur de veille technologique francophone et internationale — articles, podcasts, vidéos. Site 100 % statique, mis à jour automatiquement chaque jour.

[![Astro](https://img.shields.io/badge/Astro-5.17-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deploy-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Site en production** : [your-flux-site.example.com](https://your-flux-site.example.com/)

---

## Origine du projet

Flux est un **fork enrichi** du projet original [yoanbernabeu/flux](https://github.com/yoanbernabeu/flux) créé par [Yoan Bernabeu](https://yoandev.co). La base initiale — concept d'agrégateur RSS statique, architecture Astro, déploiement sur edge — vient de son travail.

Ce fork a été retravaillé en profondeur pour offrir une expérience plus complète :

- **Section internationale** (`/world`) en parallèle du fil francophone, avec son propre RSS sortant et son index de recherche
- **Intégration YouTube** via l'API Data v3 (au-delà du simple RSS Atom)
- **Pages dédiées** par catégorie et par source, toutes inter-liées
- **Favoris** et **« à lire plus tard »** sans compte (localStorage)
- **Recherche full-text** côté client avec Fuse.js
- **Trois vues** d'affichage (cartes, liste, liste compacte)
- **Filtres combinables** (catégorie, source, type, plage de dates)
- **Sélecteur de couleur d'accent runtime** dans le header (12 palettes au choix, persistance localStorage)
- **Mode clair / sombre** avec dégradés de fond façon Proton
- **Outil interne** de génération de tweets via Gemini (`/rs`)
- **Stats** d'agrégation, page sources, page À propos, RSS sortant double
- Refactorings de fond : tokens CSS centralisés, accessibilité (WCAG AA en mode clair), View Transitions, anti-flash, dédup SHA256, slugs normalisés, etc.

## Présentation

Flux est un **agrégateur de veille tech** entièrement statique :

- Tu déclares tes sources dans `feeds.yaml` (blogs RSS, podcasts, chaînes YouTube)
- Un job GitHub Actions tourne chaque matin (04:00 UTC), récupère les nouveaux articles, les normalise, les dédoublonne, en extrait l'image de couverture et les commit dans le repo
- Le push redéclenche un build Cloudflare Pages → site mis à jour en ~3 min

Aucun runtime serveur, aucune base de données, aucun cookie. Toutes les préférences utilisateur (thème, couleur d'accent, favoris, articles à lire plus tard, vue préférée) vivent en `localStorage` côté navigateur.

## Stack technique

| Couche | Techno | Version | Rôle |
|---|---|---|---|
| Framework | [Astro](https://astro.build) | 5.17 | Build statique, View Transitions, content collections |
| Styles | [Tailwind CSS](https://tailwindcss.com) | 4.2 | CSS via `@theme`, tokens, utilities, plugin Vite |
| Langage | [TypeScript](https://www.typescriptlang.org) | strict | Typage fort sur tout le code et les data models |
| Recherche | [Fuse.js](https://www.fusejs.io) | 7.1 | Fuzzy search côté client, chargée à la demande |
| RSS / Atom | [rss-parser](https://github.com/rbren/rss-parser) | 3.13 | Parsing iTunes (podcasts), media:content, content:encoded |
| YouTube | [YouTube Data API v3](https://developers.google.com/youtube/v3) | — | Endpoint `playlistItems` (1 unit/req) |
| YAML | [yaml](https://github.com/eemeli/yaml) | 2.8 | Lecture de `feeds.yaml` |
| RSS out | [@astrojs/rss](https://docs.astro.build/en/guides/rss/) | 4.0 | Génère `/rss.xml` et `/world/rss.xml` |
| Sitemap | [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | 3.7 | Sitemap auto |
| Scripts | [tsx](https://github.com/privatenumber/tsx) | 4.21 | Runner TS du `fetch-feeds` (avec `--env-file-if-exists`) |
| CI | GitHub Actions (Node 24) | — | Cron quotidien `fetch-feeds`, commit/push automatique |
| Hébergement | Cloudflare Pages | — | Auto-deploy sur push `main`, edge global |

## Fonctionnement

```
feeds.yaml
   │
   │  npm run fetch-feeds (local)  /  cron quotidien GitHub Actions (04:00 UTC)
   │
   ▼
scripts/fetch-feeds.ts
   ├─ Parse RSS / Atom (rss-parser)
   ├─ Récupère YouTube via API Data v3
   ├─ Extraction image en cascade (iTunes → enclosure → media → og:image → fallback source)
   ├─ Déduplication par SHA256 de l'URL (12 premiers chars)
   ├─ Traitement en parallèle par batch
   │
   ▼
data/YYYY-MM.json    ──────────►  fil francophone (/)
data-world/YYYY-MM.json  ──────►  fil international (/world)
   │
   ▼
git commit + push (CI)
   │
   ▼
Cloudflare Pages détecte le push
   ├─ npm install
   ├─ npm run build  (Astro statique → dist/)
   └─ deploy edge global
   │
   ▼
your-flux-site.example.com
```

Côté client :
- L'**index de recherche** est généré au build (`/search-index.json`) et chargé à la demande quand l'utilisateur tape
- Le **thème** et la **couleur d'accent** sont appliqués au boot via un script `is:inline` qui lit `localStorage` (anti-flash)
- Les **favoris** et **« à lire plus tard »** sont des listes localStorage manipulées par event delegation globale
- Les **View Transitions** d'Astro lissent les navigations sans recharger les preferences

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

## Ajouter un flux

Modifier le fichier `feeds.yaml` à la racine. Deux collections coexistent :
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

  # Chaîne YouTube (url = channel ID au format UCxxx...)
  - url: UCxxxxxxxxxxxxxxxxxxxxxxxx
    name: Ma Chaîne
    type: youtube
    categories: [Programmation, IA]

  # Source avec image de repli (utilisée si RSS et og:image ne donnent rien)
  - url: https://example.com/feed.xml
    name: Source Sans Image
    categories: [Web]
    fallbackImage: https://example.com/logo.png

feeds_world:
  - url: https://example.org/feed.xml
    name: International Example
    categories: [IA]
```

**Catégories** disponibles : `Programmation`, `IA`, `DevOps`, `Cybersécurité`, `Cloud`, `Web`. Tu peux en ajouter, elles seront automatiquement prises en compte (pense à ajouter le gradient associé dans `src/utils/articles.ts`).

### Image de repli par source

Certaines sources n'exposent pas d'image dans leur RSS et bloquent le scraping `og:image` (Cloudflare, blogs minimalistes…). Le champ optionnel `fallbackImage` définit une URL utilisée en dernier recours. Le fallback est ré-appliqué rétroactivement aux articles déjà en base à chaque `npm run fetch-feeds`.

## Configuration YouTube

Pour récupérer les vidéos YouTube, une clé API Google est nécessaire :

1. Créer un projet dans la [Google Cloud Console](https://console.cloud.google.com/)
2. Activer l'API **YouTube Data API v3**
3. Créer une clé API (Credentials → API Key)

**En local** : créer un fichier `.env` à la racine :
```env
YOUTUBE_API_KEY=ta_cle_ici
```

**En CI** : ajouter le secret `YOUTUBE_API_KEY` dans Settings → Secrets and variables → Actions du repo GitHub.

Le cache CI utilise `--env-file-if-exists=.env`, donc l'absence du fichier en CI est silencieuse (les vars viennent du secret).

## Personnaliser la couleur d'accent

Deux niveaux de personnalisation :

### 1. Sélecteur runtime (UI)

Dans le header du site, l'**icône palette** ouvre un sélecteur avec **12 couleurs au choix** :
`indigo`, `violet`, `blue`, `sky`, `emerald`, `green`, `amber`, `orange` (ton Korben), `red`, `rose`, `pink`, `yellow`.

Le choix est persisté en `localStorage` (`flux-accent`) et appliqué instantanément (gradient de fond, boutons, liens, badges, logo).

### 2. Couleur par défaut (build-time)

La variable d'env `FLUX_ACCENT` définit la palette par défaut pour les nouveaux visiteurs (et les utilisateurs sans JS) :

```bash
FLUX_ACCENT=blue npm run build
```

Les palettes sont définies dans `src/config/theme.ts` et injectées comme variables CSS (`--color-accent-*`). Toute l'UI consomme ces tokens, donc changer la palette suffit à re-thémer tout le site.

## Structure du projet

```
├── feeds.yaml                  # Configuration des flux (feeds + feeds_world)
├── data/                       # Articles francophones (JSON mensuel, auto-généré)
├── data-world/                 # Articles internationaux (JSON mensuel, auto-généré)
├── scripts/
│   └── fetch-feeds.ts          # Pipeline RSS + YouTube + og:image + dédup
├── src/
│   ├── components/             # ArticleCard, Header, ArticleListPage, CommandPalette…
│   ├── config/theme.ts         # 12 palettes d'accent
│   ├── layouts/Layout.astro    # Layout principal + anti-flash + accent runtime
│   ├── pages/
│   │   ├── index.astro                # Fil francophone
│   │   ├── page/[page].astro          # Pagination
│   │   ├── article/[id].astro         # Détail article (canonique vers la source)
│   │   ├── source/[slug].astro        # Page par source
│   │   ├── categorie/[slug].astro     # Page par catégorie
│   │   ├── sources.astro              # Liste des sources
│   │   ├── favoris.astro              # Favoris (localStorage)
│   │   ├── a-lire-plus-tard.astro     # À lire plus tard (localStorage)
│   │   ├── stats.astro                # Statistiques d'agrégation
│   │   ├── rs.astro                   # Outil interne tweets (Gemini)
│   │   ├── search-index.json.ts       # Index Fuse.js (fr)
│   │   ├── rss.xml.ts                 # RSS sortant fr
│   │   └── world/                     # Section internationale (pages + RSS + index)
│   ├── styles/global.css       # Tokens CSS, gradients, classes accent
│   ├── types/index.ts          # FeedConfig, Article, FeedsConfig…
│   └── utils/                  # articles.ts (loaders, slugify), userLists.ts (favs)
├── .github/workflows/          # Cron fetch-feeds quotidien
└── astro.config.mjs            # Config Astro + integrations + accent injector
```

## Commandes

| Commande | Action |
|---|---|
| `npm install` | Installer les dépendances |
| `npm run dev` | Serveur de dev (`localhost:4321`) |
| `npm run build` | Build de production (`./dist/`) |
| `npm run preview` | Prévisualiser le build |
| `npm run fetch-feeds` | Récupérer les flux RSS + YouTube |

## Déploiement

- **Hébergement** : [Cloudflare Pages](https://pages.cloudflare.com) — deploys illimités gratuits, edge global
- **URL** : [your-flux-site.example.com](https://your-flux-site.example.com/)
- **Auto-deploy** : push sur `main` → Cloudflare détecte → `npm install && npm run build` → propagation CDN (~3 min)
- **Cron** : `.github/workflows/fetch-feeds.yml` tourne chaque jour à 04:00 UTC, commit les nouveaux articles sur `main`, ce qui redéclenche le build

## Intégration DayBrief

Le RSS publié par Flux est consommé par [DayBrief](https://github.com/hakovoid/daybrief), une newsletter quotidienne IA :

```
Flux        → publie /rss.xml et /world/rss.xml
DayBrief    → lit ces flux à 05:00 UTC, résume avec Gemini, envoie un email
```

Aucune dépendance directe — DayBrief consomme le RSS comme n'importe quel agrégateur. Ils sont totalement découplés.

## Remerciements

Merci à **[Yoan Bernabeu](https://yoandev.co)** ([@yoanbernabeu](https://github.com/yoanbernabeu)) pour le projet [Flux original](https://github.com/yoanbernabeu/flux) qui a servi de point de départ. Sans son travail initial — concept, architecture statique Astro, choix techniques — ce fork n'existerait pas.

Va voir [yoandev.co](https://yoandev.co) et sa [chaîne YouTube](https://www.youtube.com/@yoandev_co), c'est de la veille tech francophone de qualité.

Merci aussi aux mainteneurs des projets open source utilisés ici (Astro, Tailwind, Fuse.js, rss-parser…) sans qui rien de tout ça ne tournerait.

## Licence

[MIT](https://opensource.org/licenses/MIT)
