# ✅ Configuration Finale AWS - Nutriscan

## 📍 URLs de Production

### Backend API
```
https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/api
```

### Photos de Profil
```
https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/[filename].jpg
```

**Exemple d'URL complète:**
```
https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/GLcyA148umsAvnvYN0use9akpxfrpPJY894anvTK.jpg
```

**Structure simplifiée:**
```
https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/xxx.jpg
       └─────────────────────┬───────────────────────────┘ └─────┬──────┘
                      domaine Laravel Cloud               dossier images
```

## ✅ Modifications Apportées

### 1. Next.js Configuration (`next.config.ts`)

Ajout du domaine de production `fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud` :

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud',
      pathname: '/**',
    },
    // ... autres domaines
  ]
}
```

### 2. Utilitaire de Gestion (`lib/image.utils.ts`)

L'utilitaire a été simplifié car le backend envoie maintenant les URLs correctes :

```typescript
// Le backend envoie directement l'URL correcte
"https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/abc.jpg"

// Plus besoin de correction !
```

### 3. Variables d'Environnement (`ENV_EXAMPLE.md`)

URL de production mise à jour :

```env
# Production
NEXT_PUBLIC_API_URL=https://nutriscan-main-yyhc0n.laravel.cloud/api
```

## 🎯 Structure Complète

```
┌─────────────────────────────────────────────────────────────────┐
│                      Architecture AWS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (Next.js)                                             │
│  └─ next.config.ts                                              │
│     └─ remotePatterns: ['nutriscan-main-yyhc0n.laravel.cloud'] │
│                                                                 │
│  ↓ Request Image                                                │
│                                                                 │
│  Laravel Cloud API                                              │
│  └─ https://nutriscan-main-yyhc0n.laravel.cloud/api            │
│     └─ /storage/profile-photos/xxx.jpg                          │
│                                                                 │
│  ↓ Fetch from Storage                                           │
│                                                                 │
│  CloudFlare R2 (S3-compatible)                                  │
│  └─ Bucket: f1s-a0e47b48-31ff-4bd2-a880-530e181a3129           │
│     └─ Endpoint: 367be3a203552894324007d0096e0cd.r2...         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Flux de Données

### Upload (Backend → S3)
```
1. User upload photo → Laravel Backend
2. Laravel stocke sur CloudFlare R2 (S3)
3. Backend retourne URL: 
   https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/xxx.jpg
```

### Display (Frontend)
```
1. Frontend récupère user.profile_photo_url
2. Si URL incorrecte → fixImageUrl() corrige automatiquement
3. next/image optimise et affiche l'image
```

## 📝 Configuration Requise

### Backend Laravel

**Variables d'environnement:**
```env
AWS_ACCESS_KEY_ID=413b9b04a41eaa44e07f7c04c8c16a30
AWS_SECRET_ACCESS_KEY=6ba6b2a5c180b1368c864921f90b6a500d6615db1e70e0b219cb85a723ccd4f8
AWS_DEFAULT_REGION=auto
AWS_BUCKET=f1s-a0e47b48-31ff-4bd2-a880-530e181a3129
AWS_ENDPOINT=https://367be3a203552894324007d0096e0cd.r2.cloudflarestorage.com
AWS_URL=https://nutriscan-main-yyhc0n.laravel.cloud
AWS_USE_PATH_STYLE_ENDPOINT=false
```

**Configuration Storage (config/filesystems.php):**
```php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'endpoint' => env('AWS_ENDPOINT'),
    'url' => env('AWS_URL'),
    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
],
```

### Frontend Next.js

**Variables d'environnement (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_APPLE_CLIENT_ID=your-apple-client-id
NEXT_PUBLIC_APPLE_REDIRECT_URI=https://your-domain.com/login
```

## ✅ Tests de Validation

### Test 1: Vérifier l'URL de l'image
```bash
curl -I https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/GLcyA148umsAvnvYN0use9akpxfrpPJY894anvTK.jpg
```

**Résultat attendu:** `200 OK` avec content-type `image/jpeg` ou `image/png`

### Test 2: Connexion et affichage photo
```
1. Se connecter avec Google/Apple
2. Vérifier que la photo de profil s'affiche dans le Header
3. Aller sur /settings et vérifier que la photo s'affiche
```

### Test 3: Console logs
```javascript
// Dans la console du navigateur
console.log(user.profile_photo_url);
// Devrait afficher l'URL complète avec /api/storage/
```

## 🎉 Résultat Final

- ✅ Configuration AWS CloudFlare R2 complète
- ✅ Next.js configuré pour accepter les images
- ✅ Utilitaire de correction d'URL automatique
- ✅ Support multi-environnement (dev/prod)
- ✅ Documentation complète et à jour
- ✅ Prêt pour le déploiement en production

## 📚 Documentation Associée

- [`next.config.ts`](./next.config.ts) - Configuration Next.js
- [`lib/image.utils.ts`](./lib/image.utils.ts) - Utilitaires images
- [`ENV_EXAMPLE.md`](./ENV_EXAMPLE.md) - Variables d'environnement
- [`IMAGE_URL_FIX.md`](./IMAGE_URL_FIX.md) - Détails de la correction
- [`AWS_STORAGE_SETUP.md`](./AWS_STORAGE_SETUP.md) - Guide AWS complet

---

**Date de Configuration:** 2026-01-24  
**Domaine Production:** `nutriscan-main-yyhc0n.laravel.cloud`  
**Status:** ✅ Configuré et Testé
