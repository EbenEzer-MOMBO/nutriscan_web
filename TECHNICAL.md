# Nutriscan Web — Documentation technique

Ce document décrit l’architecture, la configuration et les conventions du frontend **Nutriscan** : application **Next.js** (App Router) consommant une **API Laravel** pour l’authentification sociale, le profil, le journal alimentaire et les scans (repas, codes-barres).

---

## 1. Pile technique


| Composant                      | Version / détail                                                           |
| ------------------------------ | -------------------------------------------------------------------------- |
| Runtime                        | Node.js **18+** recommandé                                                 |
| Framework                      | **Next.js 16** (App Router)                                                |
| UI                             | **React 19**, **Tailwind CSS 4** (`@tailwindcss/postcss`)                  |
| Langage                        | **TypeScript** (`strict: true`)                                            |
| Données serveur / cache client | **TanStack React Query** v5                                                |
| Auth UI                        | **Google** : `@react-oauth/google` · **Apple** : `react-apple-signin-auth` |
| Scan                           | **html5-qrcode**, **@zxing/library** (codes-barres)                        |
| Icônes                         | **phosphor-react**                                                         |
| JWT côté client                | **jwt-decode** (si utilisé dans le flux)                                   |
| Lint                           | **ESLint 9** + `eslint-config-next` (core-web-vitals + TypeScript)         |


Les versions exactes sont dans `package.json`.

---

## 2. Prérequis et installation

```bash
git clone <repo>
cd nutriscan_web
npm install
```

Créer un fichier `**.env.local**` à la racine (ne pas commiter). Le contenu attendu est documenté dans `[ENV_EXAMPLE.md](./ENV_EXAMPLE.md)`. Il n’existe pas de fichier `.env.local.example` dans le dépôt : partir de `ENV_EXAMPLE.md`.

```bash
npm run dev    # http://localhost:3000
npm run build  # build production
npm run start  # serveur Next après build
npm run lint   # ESLint
```

---

## 3. Variables d’environnement

Toutes les variables utiles au navigateur sont préfixées `**NEXT_PUBLIC_**` (injectées au build).


| Variable                         | Rôle                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`            | URL de base de l’API Laravel (ex. `http://localhost:8000/api` en dev) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`   | Client ID OAuth Google (application web)                              |
| `NEXT_PUBLIC_APPLE_CLIENT_ID`    | Service ID Apple (Sign in with Apple)                                 |
| `NEXT_PUBLIC_APPLE_REDIRECT_URI` | URL de retour Apple (souvent la page `/login` en prod)                |


Référence détaillée : `[ENV_EXAMPLE.md](./ENV_EXAMPLE.md)`.  
Guides complémentaires : `[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)`, `[APPLE_SIGNIN_SETUP.md](./APPLE_SIGNIN_SETUP.md)`, `[API_SOCIAL_AUTH.md](./API_SOCIAL_AUTH.md)`, `[AWS_STORAGE_SETUP.md](./AWS_STORAGE_SETUP.md)`.

---

## 4. Architecture applicative

### 4.1 Next.js App Router

- Répertoire `**app/**` : routes, layouts, métadonnées (`layout.tsx`), styles globaux (`globals.css`).
- `**app/providers.tsx**` : enveloppe `**QueryClientProvider**` (TanStack Query) avec `staleTime` 60 s et `gcTime` 5 min.
- Pas d’API Routes métier lourdes côté Next : le client appelle directement l’API Laravel via `fetch` dans les services `lib/`.

### 4.2 Couche données et services (`lib/`)

Les appels HTTP réutilisables sont centralisés :


| Fichier                    | Responsabilité                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `auth.service.ts`          | OAuth Google/Apple → `POST /auth/google`, `POST /auth/apple`, stockage session, `GET /user` |
| `profile.service.ts`       | Profil utilisateur / onboarding côté API                                                    |
| `journal.service.ts`       | Journal (jour, mois)                                                                        |
| `mealscan.service.ts`      | Scan repas (`multipart`), détails repas, mise à jour, suppression, historique, stats        |
| `openfoodfacts.service.ts` | Scan produit par code-barres via l’API backend                                              |
| `fooditems.service.ts`     | Gestion des aliments / items liés aux repas                                                 |
| `google-oauth.ts`          | Utilitaires OAuth Google si nécessaire                                                      |
| `image.utils.ts`           | Manipulation d’images côté client                                                           |
| `hooks/use-queries.ts`     | Hooks React Query + `queryKeys` et invalidations                                            |


Les types métier sont dans `**lib/types/**` (`journal`, `mealscan`, `openfoodfacts`, `fooditems`, `profile`).

**Convention** : `API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'`.  
**Authentification API** : en-tête `Authorization: Bearer <token>` + `Accept: application/json` lorsque requis.

### 4.3 TanStack Query

- Clés centralisées dans `queryKeys` (`profile`, `journal`, `journal-month`, `meal`, etc.).
- Les mutations (ex. `useUpdateMeal`, `useDeleteMeal`) invalident les requêtes `journal`, `journal-month`, `meal-history` pour garder l’UI cohérente.
- Le hook `**useAuth`** vide le `**queryClient**` à la déconnexion pour éviter les fuites de données entre sessions.

### 4.4 Authentification et session

1. Après succès Google/Apple, `**storeAuthData**` écrit :
  - `**localStorage**` : `auth_token`, `user` (JSON) ;
  - **cookie** `auth_token` (path `/`, SameSite=Lax, durée ~30 jours) pour le **middleware** Edge.
2. `**middleware.ts`** lit le cookie `auth_token` pour autoriser ou rediriger **avant** le rendu des pages protégées.
3. Les services API lisent le token depuis `**localStorage`** côté client.

Cette double persistance permet au middleware de fonctionner sans accès au `localStorage` côté serveur.

### 4.5 Middleware (`middleware.ts`)

- **Routes publiques** : `/`, `/login`.
- **Routes protégées** (préfixe) : `/dashboard`, `/journal`, `/scan`, `/trends`, `/settings`, `/onboarding-profile`, `/add` (couvre aussi `/add-manual` via `startsWith`).
- Si route protégée sans cookie → redirection vers `/login?redirect=<pathname>`.
- Si utilisateur avec token sur `/` ou `/login` → redirection vers `/dashboard`.

**Matcher** : exclut `api`, `_next/static`, `_next/image`, `favicon.ico`, et fichiers statiques par extension (svg, png, json, js, etc.).

**Note** : d’autres chemins sous `app/` (ex. `/meal/[id]`, `/product/[barcode]`, `/create-meal`) ne sont pas listés dans `protectedRoutes` ; l’accès effectif peut dépendre des contrôles API (401) et de la navigation interne. Toute évolution du périmètre « doit être connecté » doit aligner **middleware**, **navigation** et **API**.

### 4.6 Configuration Next (`next.config.ts`)

- `**images.remotePatterns`** : domaines autorisés pour `next/image` (Cloudflare R2, hôtes Laravel Cloud, `localhost:8000/storage`, Google).
- En **développement**, `images.unoptimized` est activé pour limiter les soucis CORS avec les images distantes.

### 4.7 PWA

- `**public/manifest.json`** : métadonnées installables (nom, icônes, thème, `start_url`, etc.).
- `**public/sw.js**` : service worker.
- `**components/RegisterSW.tsx**` : enregistrement du SW au chargement.
- `**components/InstallPWA.tsx**` : UX d’installation PWA.
- Métadonnées PWA / Apple Web App dans `**app/layout.tsx**` (`manifest`, icônes, `themeColor`).

### 4.8 UI et design

- Police : **Geist** / **Geist Mono** (via `next/font/google`).
- Thème couleurs et guidelines produit : voir section « Thème & Design » du `[README.md](./README.md)`.

---

## 5. Arborescence fonctionnelle (principale)

```
nutriscan_web/
├── app/                      # Routes App Router
│   ├── page.tsx              # Landing / onboarding
│   ├── login/
│   ├── dashboard/
│   ├── journal/
│   ├── scan/
│   ├── trends/
│   ├── settings/
│   ├── onboarding-profile/
│   ├── add/                  # Ajout (flux existant)
│   ├── add-manual/
│   ├── create-meal/
│   ├── meal/[id]/
│   ├── product/[barcode]/
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/               # Composants par domaine
│   ├── dashboard/
│   ├── journal/
│   ├── scanner/
│   ├── meal/
│   ├── trends/
│   └── profile/
├── hooks/                    # useAuth, useCameraPermission, etc.
├── lib/                      # Services API, types, hooks React Query
├── public/                   # Assets, manifest, sw.js
├── middleware.ts
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json             # alias @/* → racine
└── eslint.config.mjs
```

Alias TypeScript : `**@/***` pointe vers la racine du projet (`tsconfig.json`).

---

## 6. Intégration backend (Laravel)

- Base URL : `**NEXT_PUBLIC_API_URL**` (suffixe `/api` généralement inclus dans la valeur).
- Endpoints typiques (non exhaustif ; détail dans `API_SOCIAL_AUTH.md` et le code des services) :
  - Auth : `/auth/google`, `/auth/apple`
  - Utilisateur : `/user`
  - Repas : `/meals/scan`, opérations CRUD selon `mealscan.service.ts`
  - Produits : `/products/scan`, etc.

Le backend doit exposer **CORS** pour l’origine du frontend et les routes d’auth conformes aux guides du repo.

---

## 7. Qualité et conventions

- **TypeScript** strict ; pas d’émission de `.js` (`noEmit: true`).
- **ESLint** : config plate `eslint.config.mjs`, extension Next (core-web-vitals + TypeScript).
- Préférer les **composants réutilisables** dans `components/` et la logique API dans `lib/`.

---

## 8. Déploiement

- Compatible avec tout hébergement Node capable d’exécuter **Next.js** (ex. **Vercel**).
- Définir les mêmes variables `**NEXT_PUBLIC_*`** que en local, avec l’URL d’API de production.
- Le frontend doit être servi en **HTTPS** pour OAuth, caméra et PWA hors `localhost`.

---

## 9. Dépannage technique


| Symptôme                            | Piste                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| Images distantes refusées           | Vérifier `images.remotePatterns` dans `next.config.ts` et l’URL exacte (protocole, hôte, chemin). |
| Redirection infinie ou accès refusé | Cookie `auth_token` absent après login : vérifier `storeAuthData` et domaine/path du cookie.      |
| API 401                             | Token expiré ou manquant dans `localStorage` ; re-login.                                          |
| CORS                                | Configurer le backend Laravel pour l’origine du site Next.                                        |
| PWA / caméra                        | HTTPS en prod ; permissions navigateur ; voir aussi `[README.md](./README.md)` section Dépannage. |


---

## 10. Documentation associée


| Document                                               | Contenu                                        |
| ------------------------------------------------------ | ---------------------------------------------- |
| `[README.md](./README.md)`                             | Vue produit, fonctionnalités, démarrage rapide |
| `[ENV_EXAMPLE.md](./ENV_EXAMPLE.md)`                   | Variables d’environnement                      |
| `[API_SOCIAL_AUTH.md](./API_SOCIAL_AUTH.md)`           | API backend auth                               |
| `[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)` | Mise en place auth                             |
| `[APPLE_SIGNIN_SETUP.md](./APPLE_SIGNIN_SETUP.md)`     | Apple Sign In                                  |
| `[AWS_STORAGE_SETUP.md](./AWS_STORAGE_SETUP.md)`       | Stockage images (S3/R2)                        |


---

*Document généré pour refléter l’état du dépôt ; en cas d’écart avec le code, la source de vérité est le code dans `app/`, `lib/` et `middleware.ts`.*