# Mon Devis Sans Oublis - Frontend

Plateforme d'analyse de conformité de devis pour accélérer la rénovation énergétique des logements en simplifiant l'instruction des dossiers d'aide.

🔗 **[Accéder à la plateforme](https://mon-devis-sans-oublis.beta.gouv.fr/)** 

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

⚠️ **Important** : Ne laissez jamais de variables d'environnement vides (ex: `VARIABLE=`). Si vous n'avez pas besoin d'une variable, commentez-la avec `#` ou supprimez la ligne complètement.

#### Pour l'exécution avec Docker

1. Copiez le fichier `.env.example` en `.env.docker` :

```bash
cp .env.example .env.docker
```

2. Éditez le fichier `.env.docker` avec les valeurs appropriées pour l'environnement Docker.

⚠️ **Important** : Ne laissez jamais de variables d'environnement vides (ex: `VARIABLE=`). Si vous n'avez pas besoin d'une variable, commentez-la avec `#` ou supprimez la ligne complètement.

### Variables d'environnement principales

| Variable                         | Description                           | Exemple                                                  | Requis    | Type   |
| -------------------------------- | ------------------------------------- | -------------------------------------------------------- | --------- | ------ |
| `NODE_ENV`                       | Environnement d'exécution             | `development` ou `production`                            | Requis    | Server |
| `NEXT_PUBLIC_APP_ENV`            | Environnement applicatif              | `local`, `docker`, `staging`, `production`               | Requis    | Shared |
| `NEXT_TELEMETRY_DISABLED`        | Désactive la télémétrie Next.js       | `1`                                                      | Optionnel | Server |
| `NEXT_PRIVATE_API_AUTH_TOKEN`    | Token d'authentification API          | `superAPIAuthTokenExample`                               | Requis    | Server |
| `NEXT_PUBLIC_API_URL`            | URL de l'API backend                  | `https://api.staging.mon-devis-sans-oublis.beta.gouv.fr` | Requis    | Shared |
| `NEXT_PUBLIC_MATOMO_SITE_ID`     | ID du site Matomo                     | `1`                                                      | Optionnel | Client |
| `NEXT_PUBLIC_MATOMO_URL`         | URL de l'instance Matomo              | `https://stats.beta.gouv.fr`                             | Optionnel | Client |
| `NEXT_PUBLIC_SENTRY_DSN`         | DSN Sentry pour le tracking d'erreurs | `https://xxx@sentry.io/xxx`                              | Optionnel | Client |
| `NEXT_PUBLIC_SENTRY_ORG`         | Organisation Sentry                   | `mon-organisation`                                       | Optionnel | Client |
| `NEXT_PUBLIC_SENTRY_PROJECT`     | Projet Sentry                         | `mon-devis-frontend`                                     | Optionnel | Client |
| `NEXT_PUBLIC_SENTRY_URL`         | URL de l'instance Sentry              | `https://sentry.io/`                                     | Optionnel | Client |
| `NEXT_PUBLIC_CRISP_WEBSITE_ID`   | ID du Site Crisp                      | `b3f91d7a-e29c-4e12-8c76-3fd6a218b9f1`                   | Optionnel | Client |
| `NEXT_PUBLIC_ENABLE_MOCKS`       | Active/désactive les mocks            | `true` ou `false`                                        | Optionnel | Client |
| `NEXT_PUBLIC_FORCE_MOCKS`        | Force les mocks même en production    | `true` ou `false`                                        | Optionnel | Client |
| `NEXT_PUBLIC_MOCK_DELAY`         | Délai API simulé en ms                | `500`                                                    | Optionnel | Client |
| `NEXT_PUBLIC_MOCK_SCENARIO`      | Scénario par défaut                   | `valid`, `invalid`, `empty`                              | Optionnel | Client |

### Types de variables d'environnement

L'application utilise une gestion centralisée des variables d'environnement avec validation :

- **Server** : Variables sensibles accessibles uniquement côté serveur (tokens, clés privées)
- **Client** : Variables publiques accessibles dans le navigateur (configuration UI, analytics)
- **Shared** : Variables publiques utilisées côté serveur ET client (URL d'API, environnement)

### Gestion des environnements

L'application distingue les environnements via la variable `NEXT_PUBLIC_APP_ENV` :

| Environnement | `NODE_ENV`    | `NEXT_PUBLIC_APP_ENV`    | URL                                              |
| ------------- | ------------- | ------------ | ------------------------------------------------ |
| Local         | `development` | `local`      | http://localhost:3000                            |
| Docker        | `development` | `docker`     | http://localhost:3000                            |
| Staging       | `production`  | `staging`    | https://staging.mon-devis-sans-oublis.beta.gouv.fr |
| Production    | `production`  | `production` | https://mon-devis-sans-oublis.beta.gouv.fr        |

Cette approche permet de contourner la contrainte Scalingo qui impose `NODE_ENV=production` sur tous les environnements distants.

### Configuration Scalingo

#### Staging
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=staging
NEXT_PRIVATE_API_AUTH_TOKEN=your-staging-token
NEXT_PUBLIC_API_URL=https://api.staging.mon-devis-sans-oublis.beta.gouv.fr
```

#### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PRIVATE_API_AUTH_TOKEN=your-production-token
NEXT_PUBLIC_API_URL=https://api.mon-devis-sans-oublis.beta.gouv.fr
```

**Variables optionnelles (staging et production) :**
```bash
NEXT_PUBLIC_MATOMO_SITE_ID=your-matomo-id
NEXT_PUBLIC_MATOMO_URL=https://stats.beta.gouv.fr
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_ORG=your-org
NEXT_PUBLIC_SENTRY_PROJECT=mon-devis-frontend
NEXT_PUBLIC_SENTRY_URL=https://sentry.io/
NEXT_PUBLIC_CRISP_WEBSITE_ID=your-crisp-id
```

Note : Les variables `NEXT_PUBLIC_*` sont exposées publiquement dans le bundle client.

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

### Démarrage express

```bash
# Installation et démarrage
npm install
npm run dev
```

### Scripts disponibles

| Script                    | Description                                |
| ------------------------- | ------------------------------------------ |
| `npm run dev`             | Démarre le serveur de développement        |
| `npm run build`           | Construit l'application pour la production |
| `npm run start`           | Démarre le serveur de production           |
| `npm run typecheck`       | Vérifie les types TypeScript               |
| `npm run ci`              | Lance typecheck + lint + tests             |
| `npm run test`            | Lance les tests avec Jest                  |
| `npm run test:watch`      | Lance les tests en mode watch              |
| `npm run test:coverage`   | Lance les tests avec rapport de couverture |
| `npm run storybook`       | Démarre Storybook                          |
| `npm run build-storybook` | Construit Storybook pour la production     |
| `npm run lint`            | Vérifie la qualité du code avec ESLint     |
| `npm run format`          | Formate le code avec Prettier              |
| `npm run format:check`    | Vérifie le formatage sans modifier         |
| `npm run clean`           | Supprime le cache Next.js et relance le dev |
| `npm run fresh`           | Reset complet (cache + node_modules)       |

### Vérification qualité

```bash
# Tout vérifier d'un coup
npm run ci

# Ou étape par étape
npm run typecheck
npm run lint
npm run test
```

### Commandes utiles

```bash
# Formatter automatiquement le code
npm run format

# Développer les composants isolément
npm run storybook

# Nettoyer le cache en cas de problème
npm run clean
```

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

### Vérifications automatiques

```bash
# Vérification complète (CI)
npm run ci

# Vérifications individuelles
npm run typecheck  # Types TypeScript
npm run lint       # Qualité du code
npm run test       # Tests unitaires
npm run format     # Formatage du code
```

### Configuration

- **TypeScript** : Configuration dans `tsconfig.json`
- **ESLint** : Configuration dans `.eslintrc.json`
- **Prettier** : Configuration dans `.prettierrc`
- **Jest** : Tests unitaires et coverage

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

| Technologie                                                    | Version | Description                                           |
| -------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| **[Next.js](https://nextjs.org/)**                             | 15.x    | Framework React avec rendu côté serveur et App Router |
| **[React](https://react.dev/)**                                | 19.x    | Bibliothèque pour les interfaces utilisateur          |
| **[TypeScript](https://www.typescriptlang.org/)**              | 5.x     | JavaScript typé pour un développement plus sûr        |
| **[Tailwind CSS](https://tailwindcss.com/)**                   | 4.x     | Framework CSS utilitaire                              |
| **[DSFR](https://www.systeme-de-design.gouv.fr/)**             | 1.x     | Design System de l'État français                      |
| **[Jest](https://jestjs.io/)**                                 | 29.x    | Framework de tests JavaScript                         |
| **[React Testing Library](https://testing-library.com/react)** | 16.x    | Utilitaires pour tester les composants React          |
| **[Storybook](https://storybook.js.org/)**                     | 8.x     | Outil pour développer des composants isolés           |
| **[ESLint](https://eslint.org/)**                              | 9.x     | Linter pour maintenir la qualité du code              |
| **[Zod](https://zod.dev/)**                                    | 3.x     | Validation de schémas TypeScript                      |
| **[Sentry](https://sentry.io/)**                               | 9.x     | Monitoring d'erreurs en production                    |
| **[Matomo](https://matomo.org/)**                              | -       | Analytics respectueux de la vie privée                |
| **[Crisp](https://crisp.chat/)**                               | -       | Support client et chat en direct                      |

## Architecture

### Structure des dossiers

```
src/
├── actions/           # Server Actions (Next.js 15)
│   ├── quote.actions.ts
│   ├── feedback.actions.ts
│   └── stats.actions.ts
├── components/        # Composants React réutilisables
├── lib/              # Utilitaires et configuration
│   ├── server/       # Code côté serveur
│   └── client/       # Code côté client
├── page-sections/    # Sections spécifiques aux pages
├── types/           # Types TypeScript
└── wording/         # Textes et traductions
```

### API et données

- **Server Actions** : Appels API sécurisés côté serveur
- **API Backend** : Ruby on Rails avec PostgreSQL
- **Validation** : Zod pour les schémas TypeScript

## Troubleshooting

### Problèmes de cache

Si vous rencontrez des problèmes étranges (variables d'environnement qui disparaissent, composants qui ne se mettent pas à jour, etc.) :

```bash
# Nettoyer le cache Next.js et redémarrer
npm run clean

# Si le problème persiste, reset complet
npm run fresh
```

### Erreurs courantes

**Erreur de types TypeScript :**
```bash
npm run typecheck
```

**Erreurs de lint :**
```bash
npm run lint
npm run format
```

**Tests qui échouent :**
```bash
npm run test:watch
```

**Variables d'environnement manquantes :**
- Vérifiez que `.env.local` existe
- Copiez `.env.example` si nécessaire
- Ne laissez jamais de variables vides (`VARIABLE=`)

## 🎭 Système de Mocks

Pour faciliter le développement et les tests sans dépendre du backend, l'application dispose d'un système de mocks complet.

### Configuration

Les mocks sont contrôlés par des variables d'environnement :

```bash
# Activation des mocks
NEXT_PUBLIC_ENABLE_MOCKS=true          # Active/désactive les mocks
NEXT_PUBLIC_FORCE_MOCKS=false          # Force les mocks même en production
NEXT_PUBLIC_MOCK_DELAY=500             # Délai API simulé (ms)
NEXT_PUBLIC_MOCK_SCENARIO=valid        # Scénario par défaut
```

### Utilisation

#### En développement (avec mocks)
```bash
# .env.local
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_MOCK_DELAY=300
```

#### En production (sans mocks)
```bash
# .env.production
NEXT_PUBLIC_ENABLE_MOCKS=false
```

#### Pour démonstration (mocks forcés)
```bash
NEXT_PUBLIC_FORCE_MOCKS=true
NEXT_PUBLIC_MOCK_SCENARIO=valid
```

### URLs de test

Vous pouvez tester différents scénarios en utilisant des IDs spécifiques :

- `/conseiller/dossier/valid/modifier` → Dossier parfaitement valide
- `/conseiller/dossier/invalid/modifier` → Dossier avec erreurs de cohérence
- `/conseiller/dossier/empty/modifier` → Dossier vide

### Structure des mocks

```
src/utils/mocks/
├── config.ts                    # Configuration et helpers
├── mockSelector.ts              # Sélection du bon mock
├── quoteCase/
│   ├── quoteCaseValid.mock.ts   # Dossier valide
│   └── quoteCaseInvalid.mock.ts # Dossier avec erreurs
├── quoteCheck/
│   └── quoteCheck.valid.mock.ts # Devis valides
├── gestes/
│   └── gestes.valid.mock.ts     # Gestes de rénovation
└── shared/
    └── metadata.mock.ts         # Métadonnées réutilisables
```

### Développement

Les mocks sont modulaires et réutilisables. Chaque entité (QuoteCase, QuoteCheck, Gestes) a ses propres mocks qui peuvent être combinés.

**Logs en développement :**
Quand les mocks sont actifs, vous verrez des logs dans la console :
```
🎭 MOCK UTILISÉ: getQuoteCase
📊 Data: { quoteCaseId: "valid", mockId: "case-valid-12345" }
```

**Avantages :**
- ✅ Développement sans dépendance backend
- ✅ Tests de différents scénarios facilement
- ✅ Délai simulé pour tester les loading states
- ✅ Désactivation automatique en production

### Support

Pour les problèmes techniques, vérifiez :
1. Node.js version 22.x installée
2. Variables d'environnement configurées
3. `npm install` exécuté
4. Cache Next.js nettoyé (`npm run clean`)