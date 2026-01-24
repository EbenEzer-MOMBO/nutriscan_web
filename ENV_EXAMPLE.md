# Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Configuration API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
# En production:
# NEXT_PUBLIC_API_URL=https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/api

# Google OAuth Configuration
# Obtenir depuis: https://console.cloud.google.com/
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com

# Apple Sign In Configuration
# Obtenir depuis: https://developer.apple.com/
NEXT_PUBLIC_APPLE_CLIENT_ID=your.apple.service.id
NEXT_PUBLIC_APPLE_REDIRECT_URI=https://your-domain.com/login

# AWS S3 Configuration (Référence - géré par le backend)
# Les images sont accessibles via:
# https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/xxx.jpg
AWS_BUCKET=f1s-a0e47b48-31ff-4bd2-a880-530e181a3129
AWS_DEFAULT_REGION=auto
AWS_ENDPOINT=https://367be3a203552894324007d0096e0cd.r2.cloudflarestorage.com
AWS_URL=https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud
```

## Configuration Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un existant
3. Activer l'API Google+ 
4. Créer des identifiants OAuth 2.0 (Type: Application Web)
5. Ajouter les URI de redirection autorisées :
   - `http://localhost:3000` (développement)
   - `https://votre-domaine.com` (production)
6. Copier le Client ID dans `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Configuration Apple Sign In

1. Aller sur [Apple Developer](https://developer.apple.com/account/)
2. Créer un App ID avec "Sign In with Apple" activé
3. Créer un Service ID :
   - Identifier: `com.votre-app.web` (ex: `com.nutriscan.web`)
   - Configuration "Sign In with Apple"
   - Domaines et sous-domaines autorisés : `votre-domaine.com`
   - Return URLs : `https://votre-domaine.com/login`
4. Copier le Service ID dans `NEXT_PUBLIC_APPLE_CLIENT_ID`
5. Copier l'URL de retour dans `NEXT_PUBLIC_APPLE_REDIRECT_URI`

## Configuration API Backend

Assurez-vous que votre backend Laravel est configuré avec :
- L'URL de l'API dans `NEXT_PUBLIC_API_URL`
- CORS activé pour votre domaine frontend
- Les endpoints `/api/auth/google` et `/api/auth/apple` fonctionnels

## Notes

- Les variables préfixées par `NEXT_PUBLIC_` sont exposées au navigateur
- Ne jamais commiter le fichier `.env.local` dans Git
- En production, configurer ces variables dans votre plateforme d'hébergement (Vercel, Netlify, etc.)
