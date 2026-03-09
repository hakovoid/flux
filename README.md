# Flux

Agrégateur de veille technologique RSS. Un site statique construit avec Astro et Tailwind CSS, mis à jour automatiquement chaque matin via GitHub Actions.

## Fonctionnalités

- Agrégation automatique de flux RSS (cron quotidien à 6h)
- Recherche full-text côté client (Fuse.js)
- Filtrage par catégorie et par source
- Pagination (15 articles/page)
- Pages articles dédiées avec articles similaires
- Indicateurs de fraîcheur (Nouveau / Récent)
- Marquage des articles non lus
- Flux RSS sortant pour s'abonner
- Dark mode, mobile first, View Transitions
- SEO (meta, Open Graph, sitemap, robots.txt)

## Stack

- [Astro](https://astro.build) — Framework web statique
- [Tailwind CSS v4](https://tailwindcss.com) — Styles
- [Fuse.js](https://www.fusejs.io) — Recherche côté client
- [rss-parser](https://github.com/rbren/rss-parser) — Parsing des flux RSS
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

Modifier le fichier `feeds.yaml` à la racine du projet :

```yaml
feeds:
  - url: https://example.com/feed.xml
    name: Mon Blog
    categories: [Programmation, Web]
```

Catégories disponibles : `Programmation`, `IA`, `DevOps`, `Cybersécurité`, `Cloud`, `Web`.

Vous pouvez en ajouter de nouvelles, elles seront automatiquement prises en compte.

## Structure du projet

```
├── feeds.yaml              # Configuration des flux RSS
├── data/                   # Articles (JSON mensuel, auto-généré)
├── scripts/
│   └── fetch-feeds.ts      # Script de récupération RSS
├── src/
│   ├── components/         # Composants Astro
│   ├── layouts/            # Layout principal
│   ├── pages/              # Pages du site
│   ├── styles/             # CSS global
│   ├── types/              # Types TypeScript
│   └── utils/              # Utilitaires
├── .github/workflows/      # GitHub Actions
├── netlify.toml            # Config Netlify
└── astro.config.mjs        # Config Astro
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

Le site est déployé automatiquement sur Netlify à chaque push. L'action GitHub `fetch-feeds` tourne chaque matin à 6h et commit les nouveaux articles, ce qui déclenche un redéploiement.

## Licence

MIT
