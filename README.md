# Mon Devis Sans Oublis - Frontend

Une application Next.js pour créer des devis sans oublier les éléments essentiels.

## Prérequis

- **Node.js** 22.x et npm 11+
- **Docker Desktop** (optionnel, pour l'exécution avec Docker)
- **Git** pour cloner le repository

## Installation

Clonez le repository et installez les dépendances :

```bash
git clone https://github.com/MTES-MCT/mon-devis-sans-oublis-frontend.git
cd mon-devis-sans-oublis-frontend
npm install
```

## Configuration de l'environnement

### Variables d'environnement requises

Configurez les variables d'environnement selon votre méthode d'exécution :

#### Pour l'exécution avec Node.js

1. Copiez le fichier `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

2. Éditez le fichier `.env.local` avec les valeurs réelles pour votre environnement de développement.

#### Pour l'exécution avec Docker

1. Copiez le fichier `.env.example` en `.env.docker` :

```bash
cp .env.example .env.docker
```

2. Éditez le fichier `.env.docker` avec les valeurs appropriées pour l'environnement Docker.

### Variables d'environnement principales

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environnement d'exécution | `development` ou `production` | ✅ |
| `NEXT_TELEMETRY_DISABLED` | Désactive la télémétrie Next.js | `1` | ❌ |
| `NEXT_PRIVATE_API_AUTH_TOKEN` | Token d'authentification API | `superAPIAuthTokenExample` | ✅ |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `https://api.staging.mon-devis-sans-oublis.beta.gouv.fr` | ✅ |
| `NEXT_PUBLIC_MATOMO_SITE_ID` | ID du site Matomo | `1` | ❌ |
| `NEXT_PUBLIC_MATOMO_URL` | URL de l'instance Matomo | `https://stats.beta.gouv.fr` | ❌ |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN Sentry pour le tracking d'erreurs | `https://xxx@sentry.io/xxx` | ❌ |
| `NEXT_PUBLIC_SENTRY_ORG` | Organisation Sentry | `mon-organisation` | ❌ |
| `NEXT_PUBLIC_SENTRY_PROJECT` | Projet Sentry | `mon-devis-frontend` | ❌ |
| `NEXT_PUBLIC_SENTRY_URL` | URL de l'instance Sentry | `https://sentry.io/` | ❌ |

## Démarrage du projet

### Option 1: Exécution avec Node.js (Recommandé pour le développement)

```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

### Option 2: Exécution avec Docker

1. Assurez-vous que Docker Desktop est en cours d'exécution sur votre machine.

2. Construisez et démarrez le conteneur :

```bash
docker-compose up --build
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

Pour arrêter les conteneurs :

```bash
docker-compose down
```

## Développement

### Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Construit l'application pour la production |
| `npm run start` | Démarre le serveur de production |
| `npm run test` | Lance les tests avec Jest |
| `npm run test:watch` | Lance les tests en mode watch |
| `npm run test:coverage` | Lance les tests avec rapport de couverture |
| `npm run storybook` | Démarre Storybook |
| `npm run build-storybook` | Construit Storybook pour la production |
| `npm run lint` | Vérifie la qualité du code avec ESLint |

## Storybook

Storybook permet de visualiser et développer les composants de manière isolée :

```bash
npm run storybook
```

Storybook sera disponible à l'adresse [http://localhost:6006](http://localhost:6006).

### Organisation des stories

- Les stories se trouvent dans `src/components/**/*.stories.tsx`
- Chaque composant devrait avoir sa story correspondante
- Documentez les différents états et variantes de vos composants

## Tests

### Lancer les tests

```bash
# Tests en une fois
npm run test

# Tests en mode watch (recommandé pour le développement)
npm run test:watch

# Tests avec rapport de couverture
npm run test:coverage
```

### Conventions de tests

- Les fichiers de tests sont nommés `*.test.tsx` ou `*.spec.tsx`
- Utilisez React Testing Library pour tester les composants
- Privilégiez les tests comportementaux plutôt que les tests d'implémentation
- Visez une couverture de code d'au moins 80%

## Qualité du code

### Linting

```bash
# Vérifier la qualité du code
npm run lint
```

### Configuration

- **ESLint** : Configuration dans `.eslintrc.json`
- **Prettier** : Configuration dans `.prettierrc`
- **TypeScript** : Configuration dans `tsconfig.json`

## Déploiement

### Build de production

```bash
npm run build
npm run start
```

### Déploiement avec Docker

```bash
# Build de l'image Docker
docker build -t mon-devis-frontend .

# Démarrage du conteneur
docker run -p 3000:3000 mon-devis-frontend
```

## Tech Stack

| Technologie | Version | Description |
|-------------|---------|-------------|
| **[Next.js](https://nextjs.org/)** | 15.x | Framework React avec rendu côté serveur et App Router |
| **[React](https://react.dev/)** | 19.x | Bibliothèque pour les interfaces utilisateur |
| **[TypeScript](https://www.typescriptlang.org/)** | 5.x | JavaScript typé pour un développement plus sûr |
| **[Tailwind CSS](https://tailwindcss.com/)** | 4.x | Framework CSS utilitaire |
| **[DSFR](https://www.systeme-de-design.gouv.fr/)** | 1.x | Design System de l'État français |
| **[Jest](https://jestjs.io/)** | 29.x | Framework de tests JavaScript |
| **[React Testing Library](https://testing-library.com/react)** | 16.x | Utilitaires pour tester les composants React |
| **[Storybook](https://storybook.js.org/)** | 8.x | Outil pour développer des composants isolés |
| **[ESLint](https://eslint.org/)** | 9.x | Linter pour maintenir la qualité du code |
| **[Zod](https://zod.dev/)** | 3.x | Validation de schémas TypeScript |
| **[Sentry](https://sentry.io/)** | 9.x | Monitoring d'erreurs en production |
| **[Matomo](https://matomo.org/)** | - | Analytics respectueux de la vie privée |