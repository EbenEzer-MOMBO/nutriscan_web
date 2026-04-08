# 🥗 Nutriscan - Application Web PWA

Application web progressive (PWA) pour suivre vos calories avec l'intelligence artificielle.

## 🎨 Thème & Design

**Palette de couleurs:**

- **Rouge Intense:** `#ED1C24` (Action/Force)
- **Orange Énergie:** `#F7941D` (Vitalité/Élan)
- **Violet Dynamique:** `#662D91` (Profondeur/Expertise)

**Style:**

- Boutons et éléments principaux : dégradé rouge/orange
- Ombres et effets : nuances de violet
- Effets néon sur les barres de progression
- Animations fluides et modernes
- Interface mobile-first

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Backend Laravel configuré ([voir API_SOCIAL_AUTH.md](./API_SOCIAL_AUTH.md))

### Installation

```bash
# Installer les dépendances
npm install

# Créer .env.local à partir des variables décrites dans ENV_EXAMPLE.md

# Configurer les variables d'environnement (voir ENV_EXAMPLE.md)
# Éditer .env.local avec vos clés

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Fonctionnalités

### ✅ Authentification

- 🔐 Connexion Google OAuth
- 🍎 Connexion Apple Sign In
- 🔒 Protection des routes
- 💾 Gestion des sessions

### 📊 Tableau de Bord

- 📈 Suivi des calories quotidiennes
- 🎯 Objectifs caloriques personnalisés
- 📊 Répartition des macronutriments (Protéines, Glucides, Lipides)
- 📅 Calendrier hebdomadaire
- ✨ Effets néon sur les progressions

### 📸 Scanner

- 📷 Scanner de repas avec caméra
- 🔍 Scanner de code-barres
- 🍽️ Scanner de recettes
- 🖼️ Sélection depuis la galerie

### 📖 Journal

- 📅 Calendrier mensuel interactif
- 🍳 Sections repas (Petit-déjeuner, Déjeuner, Dîner, Collations)
- 📊 Détails nutritionnels
- ✅ Indicateurs d'objectifs atteints

### 👤 Profil

- 🖼️ Photo de profil (AWS S3/CloudFlare R2)
- 📧 Informations utilisateur
- 👑 Badge Premium
- ⚙️ Paramètres de compte

### 📈 Tendances

- 📊 Statistiques (Bientôt disponible)
- 📉 Graphiques de progression
- 🎯 Analyse des objectifs

### 🎯 Onboarding Profil

- 👤 Configuration du profil
- ⚖️ Mesures corporelles
- 🏋️ Type de morphologie
- 🎯 Objectifs personnalisés

## 🛠️ Technologies

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS
- **Icônes:** Phosphor Icons
- **Authentification:** Google OAuth, Apple Sign In
- **PWA:** Service Worker, Manifest
- **Images:** Next.js Image + AWS S3/CloudFlare R2
- **TypeScript:** Configuration stricte

## 📚 Documentation

- [TECHNICAL.md](./TECHNICAL.md) - **Documentation technique complète** (architecture, auth, API, déploiement)
- [ENV_EXAMPLE.md](./ENV_EXAMPLE.md) - Configuration des variables d'environnement
- [API_SOCIAL_AUTH.md](./API_SOCIAL_AUTH.md) - Documentation complète de l'API backend
- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - Guide d'installation de l'authentification
- [APPLE_SIGNIN_SETUP.md](./APPLE_SIGNIN_SETUP.md) - Configuration Apple Sign In
- [AWS_STORAGE_SETUP.md](./AWS_STORAGE_SETUP.md) - Configuration du stockage AWS S3/R2

## 🔐 Configuration de l'Authentification

### Google OAuth

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer l'API Google+
3. Créer des identifiants OAuth 2.0
4. Configurer `NEXT_PUBLIC_GOOGLE_CLIENT_ID` dans `.env.local`

[Guide complet →](./AUTHENTICATION_SETUP.md)

### Apple Sign In

1. Créer un App ID sur [Apple Developer](https://developer.apple.com/)
2. Créer un Service ID avec "Sign In with Apple"
3. Configurer `NEXT_PUBLIC_APPLE_CLIENT_ID` et `NEXT_PUBLIC_APPLE_REDIRECT_URI`

[Guide complet →](./APPLE_SIGNIN_SETUP.md)

## 📦 Structure du Projet

```
nutriscan_web/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Onboarding (3 étapes)
│   ├── login/               # Page de connexion
│   ├── dashboard/           # Tableau de bord principal
│   ├── scan/                # Scanner de repas/produits
│   ├── journal/             # Journal alimentaire
│   ├── trends/              # Tendances et statistiques
│   ├── settings/            # Profil utilisateur
│   └── onboarding-profile/  # Configuration profil
├── components/              # Composants React
│   ├── dashboard/           # Composants du dashboard
│   ├── journal/             # Composants du journal
│   └── trends/              # Composants des tendances
├── lib/                     # Utilitaires et services
│   └── auth.service.ts      # Service d'authentification
├── hooks/                   # Hooks React personnalisés
│   └── useAuth.ts           # Hook d'authentification
├── public/                  # Assets statiques
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service Worker
└── middleware.ts            # Protection des routes
```

## 🌐 PWA (Progressive Web App)

L'application est installable sur mobile et desktop :

- 📱 Bouton d'installation dynamique
- 🔄 Service Worker pour le cache
- 📴 Fonctionnement hors ligne (partiel)
- 🏠 Icône d'application personnalisée
- 🎨 Splash screen avec branding Nutriscan

## 🎯 Flux de Navigation

1. **Non authentifié:**
  - `/` → Onboarding (3 slides)
  - `/login` → Connexion Google/Apple
  - Redirection automatique vers `/dashboard` après connexion
2. **Authentifié:**
  - `/` → Redirection automatique vers `/dashboard`
  - Navigation via Bottom Nav (Dashboard, Journal, Scan, Trends, Profile)
  - Protection des routes via middleware

## 🐛 Dépannage

### Erreur: hostname not configured

Vérifier la configuration de `next.config.ts` → `images.remotePatterns`

### PWA ne s'installe pas

- Vérifier que l'app est servie en HTTPS
- Vérifier que `manifest.json` et `sw.js` sont accessibles
- Sur iOS, utiliser "Ajouter à l'écran d'accueil"

### Camera ne fonctionne pas

- Vérifier les permissions navigateur
- L'app doit être en HTTPS (sauf localhost)

[Plus de détails →](./AWS_STORAGE_SETUP.md#-dépannage)

## 📝 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement en production

```env
NEXT_PUBLIC_API_URL=https://votre-api.laravel.cloud/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_APPLE_CLIENT_ID=...
NEXT_PUBLIC_APPLE_REDIRECT_URI=https://votre-domaine.com/login
```

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

## 📄 Licence

Projet privé - Tous droits réservés

---

**Développé avec ❤️ pour Nutriscan**