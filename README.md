<div align="center">

# Flux

**Agrégateur de veille technologique francophone et internationale**
Articles, podcasts, vidéos YouTube — site 100 % statique, mis à jour automatiquement chaque jour.

[![Astro](https://img.shields.io/badge/Astro-5.17-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-24-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deploy-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Version](https://img.shields.io/badge/version-1.2-blue.svg)](https://github.com/hakovoid/flux/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Forked from](https://img.shields.io/badge/forked%20from-yoanbernabeu%2Fflux-success?logo=github)](https://github.com/yoanbernabeu/flux)

**Site en production : à déployer sur ton propre domaine** (Cloudflare Pages, Netlify, Vercel…)

</div>

---

## Origine — fork modifié et enrichi

> Ce dépôt est un **fork modifié** du projet original [yoanbernabeu/flux](https://github.com/yoanbernabeu/flux) créé par [Yoan Bernabeu](https://yoandev.co). Le concept initial — agrégateur RSS statique en Astro — vient de son travail. À partir de cette base, le projet a été **retravaillé** pour offrir une expérience utilisateur plus riche.

**Ce qui vient déjà du projet original** (Yoan Bernabeu) — pour que le crédit aille où il faut :

- Concept d'agrégateur RSS statique en Astro 5 + Tailwind v4
- Pipeline d'ingestion (RSS / Atom + YouTube Data API v3, dédup SHA256, image en cascade)
- Sections francophone et internationale (`/`, `/world`) avec RSS sortant double
- Pages catégories (`/categorie/[slug]`), sources (`/source/[slug]`), liste des sources, stats, à propos, articles
- Recherche full-text Fuse.js, View Transitions, mode clair / sombre
- Filtres catégorie / source / type, articles similaires, indicateurs de fraîcheur, marquage articles non lus
- Sitemap, robots.txt, OpenGraph, configuration SEO

**Ce qui a vraiment été ajouté ou modifié dans ce fork** :

- **Refonte visuelle** : nouvelle palette de surfaces (type GitHub), dégradés de fond façon Proton qui suivent la couleur d'accent, cards repensées pour mieux se détacher du fond, mode clair retravaillé pour la lisibilité (variantes WCAG AA sur les accents)
- **Section `/ai`** : annonces officielles des labos d'IA en direct (OpenAI, Anthropic, Google DeepMind, Google AI, Hugging Face, NVIDIA, Microsoft Research, Mistral, Cohere, Groq) — RSS sortant dédié `/ai/rss.xml`, search index séparé. Données dans `data-ai/`, configurées dans la section `feeds_ai:` de `feeds.yaml`.
- **Page Favoris** (`/favoris`) — articles mis de côté, sans compte, persistance localStorage
- **Page À lire plus tard** (`/a-lire-plus-tard`) avec horodatage et bouton « Marquer lu »
- **Sélecteur de couleur d'accent runtime** dans le header avec 12 palettes (l'original utilisait `FLUX_ACCENT` build-time uniquement)
- 4 nouvelles palettes ajoutées : `blue`, `sky`, `pink`, `yellow` ; `orange` retravaillé vers le ton Korben
- **Trois vues d'affichage** au choix : cartes, liste, liste compacte (persisté en localStorage)
- **Sélecteur de taille de page** : 15 / 30 / 50 / 100 articles par page (au lieu d'une taille fixe)
- **Filtre de date enrichi** sur la page principale avec presets 3j / 7j / 30j / 90j et reset rapide
- **Command Palette** (`Ctrl+K`) pour navigation rapide
- **Intégration Gemini API** dans l'outil interne `/rs` (génération de tweets avec cache localStorage)
- **Anti-flash boot** : thème + couleur d'accent appliqués avant le rendu via script `is:inline`
- **Migration de Netlify vers Cloudflare Pages** (deploys illimités gratuits, edge global)
- Diverses améliorations d'UX et de polissage

## Présentation

Flux est un agrégateur de veille tech **entièrement statique** :

- Tu déclares tes sources dans `feeds.yaml` (blogs RSS, podcasts, chaînes YouTube)
- Un job GitHub Actions tourne chaque matin (04:00 UTC), récupère les nouveaux articles, les normalise, les dédoublonne, en extrait l'image de couverture et les commit dans le repo
- Le push redéclenche un build Cloudflare Pages → site mis à jour en ~3 min

Aucun runtime serveur, aucune base de données, aucun cookie. **Toutes les préférences utilisateur** (thème clair/sombre, couleur d'accent, favoris, à lire plus tard, vue préférée, articles vus) vivent en `localStorage` côté navigateur.

## Fonctionnalités

### Agrégation
- Flux RSS / Atom classiques (rss-parser, support iTunes pour podcasts)
- Chaînes YouTube via l'API Data v3 (`playlistItems`, 1 unit/req)
- Cron quotidien GitHub Actions (04:00 UTC)
- Trois collections : francophone (`/`), internationale (`/world`) et labos d'IA (`/ai`)
- Déduplication par SHA256 de l'URL
- Extraction d'image en cascade : `itunes:image` → `enclosure` → `media:content` → `media:thumbnail` → premier `<img>` du HTML → `og:image` → `fallbackImage` de la source → gradient client par catégorie

### Navigation & découverte
- Recherche full-text Fuse.js (threshold 0.3, chargée à la demande)
- Command Palette `Ctrl+K` pour navigation rapide
- 3 vues d'affichage : cartes / liste / liste compacte (toggle persisté)
- Filtres combinables : catégorie · source · type (article/podcast/YouTube) · date avec presets (3j / 7j / 30j / 90j) et reset
- Panneau de filtres pliable (état mémorisé)
- Pagination avec sélecteur de taille (15 / 30 / 50 / 100 articles par page, défaut 15)
- Pages dédiées : par catégorie, par source, liste des sources, stats
- Articles similaires en bas de page article
- Tags catégories et noms de sources cliquables partout

### Interactions utilisateur (sans compte, localStorage)
- **Favoris** — page `/favoris` dédiée
- **À lire plus tard** — page `/a-lire-plus-tard` avec horodatage et bouton « Marquer lu »
- **Articles non lus** — marquage automatique depuis la dernière visite
- **Indicateurs de fraîcheur** : badges « Nouveau » / « Récent » sur les cards
- **Préférences UI** : vue, panneau filtres, thème, couleur d'accent — toutes persistées

### Lecture
- Pages article dédiées avec :
  - Lecteur audio intégré pour les podcasts
  - Lecteur YouTube embarqué pour les vidéos
  - Canonique vers la source originale (pas de doublon SEO)
- Flux RSS sortants `/rss.xml` (fr), `/world/rss.xml` (international) et `/ai/rss.xml` (labos IA) pour s'abonner

### Theming & UX
- **Mode clair / sombre** avec toggle dans le header, anti-flash au boot
- **Sélecteur de couleur d'accent runtime** dans le header — 12 palettes
- **Couleur d'accent build-time** via `FLUX_ACCENT` (fallback no-JS / nouveaux visiteurs)
- **Dégradés de fond façon Proton** suivant la couleur d'accent choisie
- View Transitions d'Astro
- Mobile-first, responsive
- Accessibilité WCAG AA en mode clair (variantes `c600` plus foncées)

### SEO & metadata
- Meta + Open Graph + Twitter Cards
- Sitemap auto-généré
- robots.txt
- JSON-LD WebSite schema
- Canonical sur les pages article (vers la source originale)
- `noindex` sur les pages internes (`/article/*`, `/source/*`, `/categorie/*`, `/rs`, etc.)

## Stack technique

| Couche | Techno | Version | Rôle |
|---|---|---|---|
| Framework | [Astro](https://astro.build) | 5.17 | Build statique, View Transitions, content collections |
| Styles | [Tailwind CSS](https://tailwindcss.com) | 4.2 | CSS via `@theme`, tokens, utilities, plugin Vite |
| Langage | [TypeScript](https://www.typescriptlang.org) | strict | Typage fort sur tout le code |
| Recherche | [Fuse.js](https://www.fusejs.io) | 7.1 | Fuzzy search côté client, chargée à la demande |
| RSS / Atom | [rss-parser](https://github.com/rbren/rss-parser) | 3.13 | Parsing avec custom fields iTunes / media |
| YouTube | [YouTube Data API v3](https://developers.google.com/youtube/v3) | — | Endpoint `playlistItems` (1 unit/req) |
| YAML | [yaml](https://github.com/eemeli/yaml) | 2.8 | Lecture de `feeds.yaml` |
| RSS out | [@astrojs/rss](https://docs.astro.build/en/guides/rss/) | 4.0 | Génère `/rss.xml`, `/world/rss.xml` et `/ai/rss.xml` |
| Sitemap | [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | 3.7 | Sitemap auto |
| Scripts | [tsx](https://github.com/privatenumber/tsx) | 4.21 | Runner TS du `fetch-feeds` |
| Runtime | Node.js | 24 | CI + dev local |
| CI | GitHub Actions | — | Cron quotidien `fetch-feeds`, commit/push automatique |
| Hébergement | **Cloudflare Pages** | — | Auto-deploy sur push `main`, edge global |

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
   ├─ Extraction image en cascade
   ├─ Déduplication par SHA256 de l'URL
   ├─ Traitement en parallèle par batch
   │
   ▼
data/YYYY-MM.json    ──────────►  fil francophone (/)
data-world/YYYY-MM.json  ──────►  fil international (/world)
data-ai/YYYY-MM.json  ─────────►  annonces des labos IA (/ai)
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
ton-domaine.pages.dev
```

Côté client :
- L'**index de recherche** est généré au build (`/search-index.json`) et chargé à la demande
- Le **thème** et la **couleur d'accent** sont appliqués au boot via un script `is:inline` qui lit `localStorage` (anti-flash, anti-FOUC)
- Les **favoris** et **« à lire plus tard »** sont des listes localStorage manipulées par event delegation globale (compatible avec les View Transitions)
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

## Variables d'environnement

Le projet utilise huit variables d'env. Toutes sont **optionnelles avec un fallback**, mais en production tu voudras au moins définir `SITE_URL` et `SITE_NAME`.

| Variable | Quand est-elle utilisée | Fallback |
|---|---|---|
| `SITE_URL` | URL canonique du site — utilisée pour le sitemap, les `<link rel="canonical">`, les `og:image` absolus, les JSON-LD schema.org, le RSS sortant, l'outil `/rs`. | `https://your-flux-site.example.com` (placeholder cassé pour le SEO) |
| `SITE_NAME` | Nom du site affiché dans `<title>`, og:title, twitter:title, le titre des RSS sortants et la sitemap. | `Flux` |
| `SITE_PUBLISHER_NAME` | Nom de la personne / entité éditrice du site (apparaît dans le `publisher` du JSON-LD schema.org sur la home et les pages article). | non défini → bloc publisher omis du JSON-LD |
| `SITE_PUBLISHER_URL` | URL associée au publisher schema.org (profil, site perso). | non défini → champ `url` omis |
| `GITHUB_REPO_URL` | URL du repo GitHub affichée dans le header et le footer. | non défini → boutons « GitHub / Code source » masqués |
| `UMAMI_WEBSITE_ID` | Active l'injection du script Umami (analytics sans cookies). | non défini → aucun script analytics, mention « Analytique sans cookies » masquée dans le footer |
| `YOUTUBE_API_KEY` | Récupération des chaînes YouTube par `scripts/fetch-feeds.ts` (API Data v3). | aucun — les flux YouTube échouent silencieusement |
| `FLUX_ACCENT` | Couleur d'accent par défaut (build-time) pour les nouveaux visiteurs / no-JS. Une fois qu'un utilisateur a choisi via le sélecteur dans le header, sa préférence localStorage prend le pas. | `indigo` |

### En local

Créer un fichier `.env` à la racine du projet (gitignored) :

```env
# URL canonique du site (production)
SITE_URL=https://ton-domaine.exemple.com

# Identité du site (titres, RSS, schema.org)
SITE_NAME=Flux mon-pseudo
SITE_PUBLISHER_NAME=mon-pseudo
# SITE_PUBLISHER_URL=https://mon-site.com

# URL du repo GitHub (optionnel — si absent, les boutons GitHub sont masqués)
GITHUB_REPO_URL=https://github.com/ton-user/ton-fork

# ID Umami pour les analytics sans cookies (optionnel)
# UMAMI_WEBSITE_ID=

# Clé API YouTube Data v3 (https://console.cloud.google.com/apis/credentials)
YOUTUBE_API_KEY=ta_cle_youtube

# Couleur d'accent par défaut (optionnel)
# Valeurs : indigo, violet, blue, sky, emerald, green, amber, orange, red, rose, pink, yellow
FLUX_ACCENT=indigo
```

`npm run dev` et `npm run build` lisent ce fichier automatiquement. `npm run fetch-feeds` utilise `--env-file-if-exists=.env` (silencieux si absent).

### En production sur Cloudflare Pages

Les variables se définissent depuis le dashboard, **pas dans un fichier `.env`** (le `.env` n'est pas commité, donc Cloudflare ne le verra jamais).

1. https://dash.cloudflare.com → **Pages** → ton projet
2. **Settings → Environment variables**
3. Ajouter pour `Production` (et `Preview` si tu veux que les deploys de PR soient corrects) :
   - `SITE_URL` = `https://ton-projet.pages.dev` (ou ton domaine custom)
   - `SITE_NAME` = ex. `Flux mon-pseudo`
   - `SITE_PUBLISHER_NAME` = ex. `mon-pseudo` (pour le schema.org)
   - `SITE_PUBLISHER_URL` = ton site / profil (optionnel)
   - `GITHUB_REPO_URL` = `https://github.com/ton-user/ton-fork` (optionnel)
   - `UMAMI_WEBSITE_ID` = ton website-id Umami (optionnel)
   - `YOUTUBE_API_KEY` = (si tes flux YouTube doivent être à jour quand Cloudflare rebuild — sinon GitHub Actions les fetch déjà avant push)
   - `FLUX_ACCENT` = (optionnel)
4. **Save** puis **Deployments → … → Retry deployment** pour appliquer (ou attendre le prochain push).

Sans `SITE_URL`, le build prod sera fonctionnel mais le SEO sera cassé (canonicals/og:image vers `your-flux-site.example.com`).

### En CI (GitHub Actions)

Le cron `fetch-feeds` quotidien a besoin de `YOUTUBE_API_KEY` pour les flux YouTube :

1. Repo GitHub → **Settings → Secrets and variables → Actions → New repository secret**
2. Name : `YOUTUBE_API_KEY` · Value : ta clé

Le workflow `.github/workflows/fetch-feeds.yml` injecte automatiquement ce secret dans l'env du job. `SITE_URL` et `FLUX_ACCENT` ne sont pas utilisés en CI (le job ne build pas le site, il fetch les flux et commit).

## Ajouter un flux

Modifier le fichier `feeds.yaml` à la racine. Trois collections coexistent :
- `feeds:` pour les sources francophones (rendues sur `/`)
- `feeds_world:` pour les sources internationales (rendues sur `/world`)
- `feeds_ai:` pour les annonces officielles des labos d'IA (rendues sur `/ai`)

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

  # Source avec image de repli
  - url: https://example.com/feed.xml
    name: Source Sans Image
    categories: [Web]
    fallbackImage: https://example.com/logo.png

feeds_world:
  - url: https://example.org/feed.xml
    name: International Example
    categories: [IA]

feeds_ai:
  - url: https://openai.com/news/rss.xml
    name: OpenAI
    categories: [IA]
```

**Catégories** disponibles : `Programmation`, `IA`, `DevOps`, `Cybersécurité`, `Cloud`, `Web`. Tu peux en ajouter (pense à mettre à jour le gradient associé dans `src/utils/articles.ts`).

### Image de repli par source

Certaines sources n'exposent pas d'image dans leur RSS et bloquent le scraping `og:image` (Cloudflare, blogs minimalistes…). Le champ optionnel `fallbackImage` définit une URL utilisée en dernier recours. Le fallback est ré-appliqué rétroactivement aux articles déjà en base à chaque `npm run fetch-feeds`.

## Obtenir une clé YouTube

Pour récupérer les vidéos YouTube via l'API Data v3 :

1. Créer un projet dans la [Google Cloud Console](https://console.cloud.google.com/)
2. Activer l'API **YouTube Data API v3**
3. Créer une clé API (Credentials → API Key)

Renseigner ensuite la clé via la variable `YOUTUBE_API_KEY` (voir la section [Variables d'environnement](#variables-denvironnement) ci-dessus).

## Personnaliser la couleur d'accent

Deux niveaux de personnalisation cohabitent :

### 1. Sélecteur runtime dans l'UI

Dans le header (desktop **et** mobile), une **icône palette** ouvre un sélecteur avec **12 couleurs** :

| Palette | Tonalité |
|---|---|
| `indigo` | Indigo |
| `violet` | Violet |
| `blue` | Bleu foncé |
| `sky` | Bleu clair |
| `emerald` | Émeraude |
| `green` | Vert |
| `amber` | Ambre |
| `orange` | Orange (ton Korben) |
| `red` | Rouge |
| `rose` | Rose foncé |
| `pink` | Rose |
| `yellow` | Jaune |

Le choix est persisté en `localStorage` (`flux-accent`) et appliqué instantanément : gradient de fond, boutons, liens, badges, logo, dot d'activité, bouton « Marquer lu », pagination active, etc.

### 2. Couleur par défaut (optionnel, build-time)

La variable d'env `FLUX_ACCENT` ne sert que de **fallback** : c'est la couleur affichée à un visiteur qui n'a encore rien choisi dans le sélecteur (ou qui a JavaScript désactivé). Dès qu'un utilisateur clique sur une couleur, son choix est stocké en `localStorage` et prend le pas sur cette valeur par défaut — y compris s'il revient après un rebuild.

En pratique, il n'y a pas besoin de toucher à `FLUX_ACCENT` pour changer la couleur du site, le sélecteur dans l'UI suffit. La variable existe surtout pour fixer la première impression d'un nouveau visiteur. Les palettes sont définies dans `src/config/theme.ts` (variables CSS `--color-accent-*` consommées par toute l'UI).

## Mode clair / sombre

Le toggle dans le header (icône soleil/lune) bascule entre les deux modes. Le choix est persisté en `localStorage` (`flux-theme`) et appliqué au boot via un script `is:inline` (anti-flash). Le `prefers-color-scheme` du navigateur sert de défaut pour les nouveaux visiteurs.

En mode clair, les variantes WCAG AA des couleurs d'accent sont automatiquement utilisées (`c600` au lieu de `c500`) pour garantir la lisibilité sur fond blanc.

## Structure du projet

```
├── feeds.yaml                  # Configuration des flux (feeds + feeds_world + feeds_ai)
├── data/                       # Articles francophones (JSON mensuel, auto-généré)
├── data-world/                 # Articles internationaux (JSON mensuel, auto-généré)
├── data-ai/                    # Annonces des labos d'IA (JSON mensuel, auto-généré)
├── scripts/
│   └── fetch-feeds.ts          # Pipeline RSS + YouTube + og:image + dédup
├── src/
│   ├── components/             # ArticleCard, Header, ArticleListPage, CommandPalette,
│   │                           # BackToTop, ArticleListItem(Compact), CategoryFilter…
│   ├── config/theme.ts         # 12 palettes d'accent
│   ├── layouts/Layout.astro    # Layout principal + anti-flash thème + accent runtime
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
│   │   ├── a-propos.astro             # À propos
│   │   ├── rs.astro                   # Outil tweets (Gemini)
│   │   ├── search-index.json.ts       # Index Fuse.js (fr)
│   │   ├── rss.xml.ts                 # RSS sortant fr
│   │   ├── world/                     # Section internationale (pages + RSS + index)
│   │   └── ai/                        # Section labos IA (pages + RSS + index)
│   ├── styles/global.css       # Tokens CSS, gradients, classes accent
│   ├── types/index.ts          # FeedConfig, Article, FeedsConfig…
│   └── utils/                  # articles.ts (loaders, slugify), userLists.ts
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
- **URL de production** : à configurer dans Cloudflare Pages (ex. `ton-projet.pages.dev` ou domaine custom)
- **Auto-deploy** : push sur `main` → Cloudflare détecte → `npm install && npm run build` → propagation CDN (~3 min)
- **Cron** : `.github/workflows/fetch-feeds.yml` tourne chaque jour à 04:00 UTC, commit les nouveaux articles sur `main`, ce qui redéclenche le build

## Intégration DayBrief

Le RSS publié par Flux est consommé par [DayBrief](https://github.com/hakovoid/daybrief), une newsletter quotidienne IA :

```
Flux        → publie /rss.xml et /world/rss.xml
DayBrief    → lit ces flux à 05:00 UTC, résume avec Gemini, envoie un email
```

Aucune dépendance directe — DayBrief consomme le RSS comme n'importe quel agrégateur. Les deux projets sont totalement découplés.

## Remerciements

Un grand merci à **[Yoan Bernabeu](https://yoandev.co)** ([@yoanbernabeu](https://github.com/yoanbernabeu)) pour son projet original [**Flux**](https://github.com/yoanbernabeu/flux) qui a servi de point de départ à ce fork.

Va voir son site **[yoandev.co](https://yoandev.co)** et sa **[chaîne YouTube](https://www.youtube.com/@yoandev_co)** : c'est de la veille tech francophone de qualité, accessible et passionnante.

Merci également aux mainteneurs des projets open source utilisés ici :
[Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), [Fuse.js](https://www.fusejs.io), [rss-parser](https://github.com/rbren/rss-parser), [tsx](https://github.com/privatenumber/tsx), et tous les autres listés dans `package.json`.

## Licence

[MIT](https://opensource.org/licenses/MIT) — fork sous la même licence que le projet original.
