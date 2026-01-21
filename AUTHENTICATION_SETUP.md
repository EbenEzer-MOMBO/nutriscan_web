# 🔐 Configuration de l'Authentification Nutriscan

## Vue d'ensemble

L'authentification Nutriscan utilise **Google OAuth** et **Apple Sign In** via votre API backend Laravel. Le frontend gère le flux OAuth et communique avec votre endpoint `/api/auth/google`.

---

## 📦 Fichiers Créés

### Services
- **`lib/auth.service.ts`** - Service principal d'authentification
  - `loginWithGoogle()` - Connexion avec Google
  - `loginWithApple()` - Connexion avec Apple
  - `getUser()` - Récupérer l'utilisateur connecté
  - `getAuthToken()` - Récupérer le token
  - `isAuthenticated()` - Vérifier si authentifié
  - `logout()` - Déconnexion

- **`lib/google-oauth.ts`** - Utilitaires Google OAuth
  - Initialisation du SDK Google
  - Gestion des tokens
  - Décodage JWT

### Hooks
- **`hooks/useAuth.ts`** - Hook React pour l'authentification
  - `useAuth()` - Accéder aux données d'authentification
  - `useRequireAuth()` - Protéger les routes côté client

### Middleware
- **`middleware.ts`** - Protection des routes côté serveur
  - Redirection automatique vers `/login` si non authentifié
  - Redirection vers `/dashboard` si déjà authentifié

### Configuration
- **`ENV_EXAMPLE.md`** - Guide de configuration des variables d'environnement

---

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install @react-oauth/google jwt-decode
```

✅ **Déjà installé**

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# URL de votre API backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
```

### 3. Configurer Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un projet ou sélectionner un existant
3. Activer l'API "Google+ API"
4. Créer des identifiants OAuth 2.0 :
   - Type : **Application Web**
   - URI de redirection autorisées :
     - `http://localhost:3000` (dev)
     - `https://votre-domaine.com` (prod)
5. Copier le **Client ID** dans `.env.local`

---

## 🔄 Flux d'Authentification

### Connexion Google

```
1. Utilisateur clique sur "Continuer avec Google"
   ↓
2. Popup Google OAuth s'ouvre
   ↓
3. Utilisateur autorise l'application
   ↓
4. Google retourne un access_token
   ↓
5. Frontend envoie le token à POST /api/auth/google
   ↓
6. Backend valide le token et crée/connecte l'utilisateur
   ↓
7. Backend retourne { user, token }
   ↓
8. Frontend stocke le token dans localStorage + cookies
   ↓
9. Redirection vers /dashboard
```

### Format de la requête API

**Endpoint:** `POST /api/auth/google`

**Headers:**
```http
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "access_token": "ya29.a0AfH6SMBx..."
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Connexion avec Google réussie",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "user",
      "profile_photo_url": "http://localhost:8000/storage/profile-photos/abc123.jpg",
      "provider": "google"
    },
    "token": "3|abcdefghijklmnopqrstuvwxyz..."
  }
}
```

---

## 💾 Stockage des Données

### LocalStorage
- `auth_token` - Token d'authentification
- `user` - Objet utilisateur (JSON)

### Cookies
- `auth_token` - Token (pour le middleware Next.js)
- Durée : 30 jours
- SameSite : Lax

---

## 🛡️ Protection des Routes

### Middleware (Automatique)

Le middleware protège automatiquement ces routes :
- `/dashboard`
- `/journal`
- `/scan`
- `/trends`
- `/settings`
- `/onboarding-profile`
- `/add`

Si non authentifié → Redirection vers `/login`

### Hook useRequireAuth (Composants)

Pour protéger un composant :

```tsx
import { useRequireAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useRequireAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <div>Contenu protégé</div>;
}
```

### Hook useAuth (Accès aux données)

Pour accéder aux données utilisateur :

```tsx
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, token, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <p>Bonjour {user?.name}</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

---

## 🔧 Utilisation dans les Composants

### Page Login

La page `/app/login/page.tsx` est déjà configurée avec :
- Google OAuth intégré
- Gestion des erreurs
- États de chargement
- Redirection automatique après connexion

### Appeler l'API avec le Token

```tsx
import { getAuthToken } from '@/lib/auth.service';

async function fetchProtectedData() {
  const token = getAuthToken();
  
  const response = await fetch('http://localhost:8000/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  
  return response.json();
}
```

---

## 🍎 Apple Sign In

✅ **Implémenté !**

Le service `loginWithApple()` est configuré avec :

1. **SDK Apple** : `react-apple-signin-auth` ✅ Installé
2. **Page de login** : Intégration du composant Apple Sign In ✅
3. **Service d'authentification** : Gestion du `id_token` Apple ✅

### Configuration Requise

Consultez le guide complet : **[APPLE_SIGNIN_SETUP.md](./APPLE_SIGNIN_SETUP.md)**

**Résumé rapide :**
1. Créer un App ID sur Apple Developer
2. Créer un Service ID pour le Web
3. Générer une clé `.p8` pour le backend
4. Configurer les variables d'environnement :
   ```env
   NEXT_PUBLIC_APPLE_CLIENT_ID=com.nutriscan.web
   NEXT_PUBLIC_APPLE_REDIRECT_URI=https://nutriscan.app/login
   ```

### Format de la requête API

**Endpoint:** `POST /api/auth/apple`

**Body:**
```json
{
  "id_token": "eyJraWQiOiJXNldjT0tC..."
}
```

**Réponse attendue :** Identique à Google OAuth

---

## 🧪 Test en Développement

### Mode DEBUG

Dans `app/login/page.tsx`, la constante `DEBUG = true` permet d'afficher les boutons de connexion même si la PWA n'est pas installée.

Pour tester :

1. Configurer `.env.local` avec votre Google Client ID
2. Lancer le serveur : `npm run dev`
3. Aller sur `http://localhost:3000/login`
4. Cliquer sur "Continuer avec Google"
5. Vérifier la console pour les logs

### Sans Backend

Si le backend n'est pas disponible, vous verrez une erreur dans la console. Pour tester l'interface uniquement, commentez temporairement l'appel API dans `handleGoogleLogin`.

---

## 📝 Checklist de Configuration

- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Google OAuth configuré (Client ID obtenu)
- [ ] Backend Laravel configuré avec l'endpoint `/api/auth/google`
- [ ] CORS activé sur le backend pour votre domaine frontend
- [ ] Test de connexion Google réussi
- [ ] Token stocké correctement
- [ ] Redirection vers dashboard fonctionne
- [ ] Protection des routes active

---

## 🐛 Dépannage

### "Google OAuth client not loaded"
- Vérifier que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est défini
- Vérifier la connexion Internet
- Ouvrir la console et chercher les erreurs de chargement du SDK

### "Erreur lors de la connexion avec Google"
- Vérifier que le backend est accessible
- Vérifier l'URL de l'API dans `.env.local`
- Vérifier les logs du backend Laravel
- Vérifier que CORS est configuré

### Redirection infinie
- Vérifier que le token est bien stocké
- Vérifier le middleware (`middleware.ts`)
- Vérifier les cookies dans les DevTools

### Token expiré
- Implémenter un refresh token côté backend
- Ajouter une gestion d'expiration dans `auth.service.ts`

---

## 🎯 Prochaines Étapes

1. **Configurer le backend** avec l'endpoint Google OAuth
2. **Tester la connexion** en développement
3. **Implémenter Apple Sign In** (optionnel)
4. **Ajouter un refresh token** pour renouveler automatiquement
5. **Gérer l'expiration** du token avec redirection
6. **Ajouter des tests** unitaires pour les services

---

## 📚 Ressources

- [Documentation @react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Laravel Socialite](https://laravel.com/docs/socialite)
