# Configuration du Stockage AWS S3 / CloudFlare R2

## 📦 Vue d'ensemble

L'application Nutriscan utilise **CloudFlare R2** (compatible S3) pour le stockage des images et fichiers utilisateurs. Les fichiers sont servis via Laravel Cloud pour une meilleure intégration avec le backend.

## 🔧 Configuration

### URLs de Production

```
AWS Bucket: f1s-a0e47b48-31ff-4bd2-a880-530e181a3129
Region: auto
Endpoint: https://367be3a203552894324007d0096e0cd.r2.cloudflarestorage.com
Public URL: https://f1s-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud
```

### Configuration Next.js

Le fichier `next.config.ts` a été configuré pour accepter les images depuis :

1. **CloudFlare R2** (stockage direct)
   ```
   https://367be3a203552894324007d0096e0cd.r2.cloudflarestorage.com/**
   ```

2. **Laravel Cloud** (URL publique via backend)
   ```
   https://f1s-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/**
   ```

3. **Localhost** (développement local)
   ```
   http://localhost:8000/storage/**
   http://127.0.0.1:8000/storage/**
   ```

4. **Google OAuth** (photos de profil)
   ```
   https://*.googleusercontent.com/**
   https://*.google.com/**
   ```

## 📸 Utilisation dans le Code

### Afficher une image de profil

```tsx
import Image from "next/image";

// L'URL vient directement du backend
const profilePhotoUrl = user.profile_photo_url;

// Next.js gère automatiquement l'optimisation
<Image 
  src={profilePhotoUrl} 
  alt={user.name}
  width={40}
  height={40}
  className="rounded-full"
/>
```

### Format des URLs Backend

Le backend Laravel renvoie des URLs complètes :

**Développement:**
```
http://localhost:8000/storage/profile-photos/xyz123.jpg
```

**Production:**
```
https://f1s-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/storage/profile-photos/xyz123.jpg
```

## 🔐 Sécurité

- ✅ Les images de profil sont publiquement accessibles
- ✅ CORS configuré pour autoriser les requêtes depuis le frontend
- ✅ Optimisation des images désactivée en développement pour éviter les problèmes CORS
- ✅ En production, Next.js optimise automatiquement les images

## 🚀 Déploiement

### Variables d'Environnement Frontend

Le frontend n'a pas besoin de clés AWS. Les URLs sont gérées par le backend.

```env
# Pas de variables AWS nécessaires côté frontend
# Les images sont accessibles via les URLs publiques
```

### Variables d'Environnement Backend

Le backend Laravel nécessite les clés AWS pour uploader les fichiers :

```env
AWS_ACCESS_KEY_ID=413b9b04a41eaa44e07f7c04c8c16a30
AWS_SECRET_ACCESS_KEY=6ba6b2a5c180b1368c864921f90b6a500d6615db1e70e0b219cb85a723ccd4f8
AWS_DEFAULT_REGION=auto
AWS_BUCKET=f1s-a0e47b48-31ff-4bd2-a880-530e181a3129
AWS_ENDPOINT=https://367be3a203552894324007d0096e0cd.r2.cloudflarestorage.com
AWS_URL=https://f1s-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud
AWS_USE_PATH_STYLE_ENDPOINT=false
```

## 🐛 Dépannage

### Erreur: "hostname not configured under images"

**Solution:** Vérifier que le hostname est bien dans `next.config.ts` → `images.remotePatterns`

### Erreur: "400 Bad Request" pour les images

**Solution:** En développement, `unoptimized: true` est activé pour éviter ce problème

### Images ne s'affichent pas

1. Vérifier que l'URL est correcte dans la console
2. Vérifier que le CORS est activé sur le backend
3. Vérifier que le fichier existe dans le bucket S3

## 📚 Références

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [CloudFlare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Laravel Cloud Storage](https://laravel.com/docs/filesystem)
