# 🍎 Configuration Apple Sign In - Nutriscan

## Vue d'ensemble

Ce guide vous aide à configurer Apple Sign In pour l'application Nutriscan. Apple Sign In permet aux utilisateurs de se connecter avec leur Apple ID de manière sécurisée.

---

## 📋 Prérequis

- Un compte Apple Developer (99$/an)
- Un domaine vérifié (ex: `nutriscan.app`)
- Accès à [Apple Developer Portal](https://developer.apple.com/account/)

---

## 🚀 Configuration Apple Developer

### Étape 1 : Créer un App ID

1. Aller sur [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
2. Cliquer sur **"+"** pour créer un nouvel identifier
3. Sélectionner **App IDs** → **Continue**
4. Choisir **App** → **Continue**
5. Remplir les informations :
   - **Description** : `Nutriscan App`
   - **Bundle ID** : `com.nutriscan.app` (exemple)
   - **Explicit** (pas Wildcard)
6. Dans **Capabilities**, cocher **Sign In with Apple**
7. Cliquer sur **Continue** → **Register**

### Étape 2 : Créer un Service ID (pour le Web)

1. Retourner sur **Identifiers** → **"+"**
2. Sélectionner **Services IDs** → **Continue**
3. Remplir :
   - **Description** : `Nutriscan Web`
   - **Identifier** : `com.nutriscan.web` (Service ID)
4. Cocher **Sign In with Apple**
5. Cliquer sur **Configure** à côté de "Sign In with Apple"

#### Configuration Sign In with Apple

1. **Primary App ID** : Sélectionner l'App ID créé à l'étape 1
2. **Domains and Subdomains** :
   - Production : `nutriscan.app`
   - Développement : `localhost` (peut ne pas fonctionner)
3. **Return URLs** :
   - Production : `https://nutriscan.app/login`
   - Développement : `http://localhost:3000/login`
4. Cliquer sur **Save** → **Continue** → **Register**

### Étape 3 : Créer une Clé (Key) pour le Backend

> ⚠️ **Important** : Cette clé est nécessaire pour le backend Laravel pour vérifier les tokens Apple.

1. Aller sur **Keys** → **"+"**
2. Remplir :
   - **Key Name** : `Nutriscan Apple Sign In Key`
3. Cocher **Sign In with Apple**
4. Cliquer sur **Configure** à côté de "Sign In with Apple"
5. **Primary App ID** : Sélectionner votre App ID
6. Cliquer sur **Save** → **Continue** → **Register**
7. **📥 TÉLÉCHARGER LA CLÉ** (fichier `.p8`) - Elle ne sera affichée qu'une fois !
8. Noter le **Key ID** (ex: `ABC123XYZ`)

---

## ⚙️ Configuration Frontend Next.js

### 1. Variables d'environnement

Créer/Modifier le fichier `.env.local` :

```env
# Apple Sign In Configuration
NEXT_PUBLIC_APPLE_CLIENT_ID=com.nutriscan.web
NEXT_PUBLIC_APPLE_REDIRECT_URI=https://nutriscan.app/login
```

### 2. Configuration pour le développement local

Pour tester en local, vous pouvez utiliser :

```env
NEXT_PUBLIC_APPLE_CLIENT_ID=com.nutriscan.web
NEXT_PUBLIC_APPLE_REDIRECT_URI=http://localhost:3000/login
```

> ⚠️ **Note** : Apple peut bloquer `localhost` pour certaines fonctionnalités. Utilisez un tunnel HTTPS (ngrok, localtunnel) si nécessaire.

---

## 🔧 Configuration Backend Laravel

### 1. Variables d'environnement Laravel

Dans votre fichier `.env` Laravel :

```env
APPLE_CLIENT_ID=com.nutriscan.web
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=ABC123XYZ
APPLE_PRIVATE_KEY_PATH=/path/to/AuthKey_ABC123XYZ.p8
```

### 2. Trouver votre Team ID

1. Aller sur [Apple Developer Membership](https://developer.apple.com/account/#/membership/)
2. Copier le **Team ID** (10 caractères)

### 3. Configurer Laravel Socialite (si utilisé)

Dans `config/services.php` :

```php
'apple' => [
    'client_id' => env('APPLE_CLIENT_ID'),
    'client_secret' => env('APPLE_CLIENT_SECRET'), // Généré à partir de la clé .p8
    'redirect' => env('APPLE_REDIRECT_URI'),
],
```

### 4. Endpoint API `/api/auth/apple`

Votre backend doit :
1. Recevoir le `id_token` depuis le frontend
2. Vérifier le token avec les clés publiques Apple
3. Extraire les informations utilisateur (email, name)
4. Créer/Connecter l'utilisateur
5. Retourner un token d'authentification

Exemple de réponse attendue :

```json
{
  "success": true,
  "message": "Connexion avec Apple réussie",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@privaterelay.appleid.com",
      "role": "user",
      "profile_photo_url": null,
      "provider": "apple"
    },
    "token": "3|abcdefghijklmnopqrstuvwxyz..."
  }
}
```

---

## 🧪 Test en Développement

### Test avec ngrok (Recommandé)

1. Installer ngrok : `npm install -g ngrok`
2. Lancer votre app Next.js : `npm run dev`
3. Créer un tunnel HTTPS :
   ```bash
   ngrok http 3000
   ```
4. Vous obtiendrez une URL : `https://abc123.ngrok.io`
5. Ajouter cette URL dans Apple Developer :
   - **Domains** : `abc123.ngrok.io`
   - **Return URLs** : `https://abc123.ngrok.io/login`
6. Mettre à jour `.env.local` :
   ```env
   NEXT_PUBLIC_APPLE_REDIRECT_URI=https://abc123.ngrok.io/login
   ```
7. Accéder à `https://abc123.ngrok.io/login` pour tester

### Test sans ngrok (Limitations)

Apple Sign In peut ne pas fonctionner sur `localhost` directement. Si vous rencontrez des erreurs, utilisez ngrok.

---

## 📱 Flux d'Authentification

```
1. Utilisateur clique sur "Continuer avec Apple"
   ↓
2. Popup Apple Sign In s'ouvre
   ↓
3. Utilisateur se connecte avec son Apple ID
   ↓
4. Apple retourne un id_token + authorization code
   ↓
5. Frontend envoie id_token à POST /api/auth/apple
   ↓
6. Backend vérifie le token avec les clés publiques Apple
   ↓
7. Backend extrait email et crée/connecte l'utilisateur
   ↓
8. Backend retourne { user, token }
   ↓
9. Frontend stocke le token et redirige vers /dashboard
```

---

## 🔍 Informations Utilisateur

### Données disponibles

- **Email** : Fourni par Apple (peut être masqué avec Private Relay)
- **Nom** : Fourni uniquement lors de la première connexion
- **Photo** : Non disponible via Apple Sign In

### Email masqué (Private Relay)

Si l'utilisateur choisit "Masquer mon e-mail", Apple fournit un email de type :
- `randomstring@privaterelay.appleid.com`
- Cet email redirige vers l'email réel de l'utilisateur
- Votre backend peut envoyer des emails à cette adresse

---

## 🐛 Dépannage

### Erreur : "Invalid client"

- Vérifier que `NEXT_PUBLIC_APPLE_CLIENT_ID` correspond au Service ID
- Vérifier que le domaine est bien configuré dans Apple Developer

### Erreur : "Redirect URI mismatch"

- Vérifier que `NEXT_PUBLIC_APPLE_REDIRECT_URI` est exactement le même que dans Apple Developer
- Vérifier le protocole (http vs https)
- Pas de `/` à la fin de l'URL

### Popup bloquée

- Vérifier les paramètres du navigateur
- Essayer avec `usePopup: false` (redirige vers Apple au lieu d'une popup)

### "The operation couldn't be completed"

- Apple Sign In ne fonctionne pas sur `localhost` sans HTTPS
- Utiliser ngrok ou un tunnel HTTPS

### Token invalide côté backend

- Vérifier que la clé `.p8` est correcte
- Vérifier le `APPLE_KEY_ID`
- Vérifier le `APPLE_TEAM_ID`

---

## 📚 Ressources

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Apple Developer Portal](https://developer.apple.com/account/)
- [react-apple-signin-auth](https://www.npmjs.com/package/react-apple-signin-auth)
- [Laravel Socialite Apple](https://github.com/SocialiteProviders/Apple)

---

## ✅ Checklist de Configuration

### Frontend
- [ ] `react-apple-signin-auth` installé
- [ ] Variables d'environnement configurées
- [ ] `APPLE_CLIENT_ID` (Service ID)
- [ ] `APPLE_REDIRECT_URI` configurée
- [ ] Domaine ajouté dans Apple Developer
- [ ] Return URL ajoutée dans Apple Developer

### Backend
- [ ] Clé `.p8` téléchargée et stockée en sécurité
- [ ] `APPLE_TEAM_ID` configuré
- [ ] `APPLE_KEY_ID` configuré
- [ ] Endpoint `/api/auth/apple` créé
- [ ] Vérification du token implémentée
- [ ] Gestion de l'email masqué

### Test
- [ ] Test avec Google Chrome
- [ ] Test avec Safari
- [ ] Test sur iOS (Safari)
- [ ] Test avec email normal
- [ ] Test avec email masqué (Private Relay)

---

## 🎯 Différences avec Google OAuth

| Aspect | Google OAuth | Apple Sign In |
|--------|-------------|---------------|
| **Email** | Toujours fourni | Peut être masqué |
| **Nom** | Toujours disponible | Uniquement à la première connexion |
| **Photo** | Avatar Google | Non disponible |
| **Configuration** | Plus simple | Plus complexe (clé .p8) |
| **localhost** | Fonctionne | Requiert HTTPS |
| **Popup** | Toujours disponible | Peut être bloquée |

---

## 🔒 Sécurité

- Ne jamais exposer la clé `.p8` publiquement
- Stocker la clé `.p8` en dehors du repo Git
- Utiliser des variables d'environnement pour les secrets
- Vérifier toujours le token côté backend
- Ne pas faire confiance aux données client

---

## 📝 Notes de Production

1. Utiliser un domaine HTTPS vérifié
2. Configurer les Return URLs de production
3. Tester sur plusieurs appareils Apple
4. Prévoir un fallback si Apple Sign In échoue
5. Gérer le cas où le nom n'est pas fourni (connexions suivantes)
