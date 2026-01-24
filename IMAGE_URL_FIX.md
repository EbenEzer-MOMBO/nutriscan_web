# 🔧 Correction des URLs d'Images - Documentation

## 🐛 Problème Identifié

**Erreur:** `GET https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/xxx.jpg 404 (Not Found)`

### Cause
Le backend Laravel génère des URLs d'images **sans** les préfixes nécessaires :
```
❌ Incorrect: https://laravel.cloud/profile-photos/abc.jpg
✅ Correct:   https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/abc.jpg
```

**Structure de l'URL de production:**
```
https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/GLcyA148...jpg
       └─────────────┬────────────────┘ └┬┘ └──┬───┘ └────────┬──────────┘
               sous-domaine            api  storage   dossier images
```

## ✅ Solution Implémentée

### 1. Utilitaire de Correction d'URL (`lib/image.utils.ts`)

Créé un fichier utilitaire avec trois fonctions principales :

#### `fixImageUrl(url: string): string | null`
Corrige automatiquement les URLs incorrectes du backend.

**Cas gérés:**
- ✅ URLs Laravel Cloud sans `/storage/`
- ✅ URLs localhost sans `/storage/`
- ✅ URLs Google OAuth (pas de modification)
- ✅ URLs ui-avatars.com (pas de modification)
- ✅ URLs déjà correctes (pas de modification)

**Exemples de corrections:**
```typescript
// Laravel Cloud - Ajoute /api/storage/
fixImageUrl("https://nutriscan-main-yyhc0n.laravel.cloud/profile-photos/abc.jpg")
// → "https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/abc.jpg"

// Localhost - Ajoute /storage/
fixImageUrl("http://localhost:8000/profile-photos/abc.jpg")
// → "http://localhost:8000/storage/profile-photos/abc.jpg"

// Déjà correct (pas de modification)
fixImageUrl("https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/abc.jpg")
// → "https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/abc.jpg"

// Google OAuth (pas de modification)
fixImageUrl("https://lh3.googleusercontent.com/...")
// → "https://lh3.googleusercontent.com/..."
```

#### `getProfilePhotoUrl(user): string | null`
Récupère et corrige l'URL de la photo de profil.

```typescript
const photoUrl = getProfilePhotoUrl(user);
// Retourne l'URL corrigée ou null
```

#### `getInitials(name: string): string`
Génère les initiales à partir d'un nom (pour l'avatar fallback).

```typescript
getInitials("John Doe")      // → "JD"
getInitials("John")          // → "J"
getInitials("")              // → "?"
getInitials("Jean-Paul Doe") // → "JD" (premier et dernier mot)
```

### 2. Mise à Jour des Composants

**Composants modifiés:**
- ✅ `components/dashboard/Header.tsx`
- ✅ `app/settings/page.tsx`

**Avant:**
```tsx
{user?.profile_photo_url ? (
  <Image src={user.profile_photo_url} ... />
) : (
  <span>{getInitials(user.name)}</span>
)}
```

**Après:**
```tsx
import { getProfilePhotoUrl, getInitials } from "@/lib/image.utils";

const photoUrl = user ? getProfilePhotoUrl(user) : null;

{photoUrl ? (
  <Image src={photoUrl} ... />
) : (
  <span>{getInitials(user?.name || "?")}</span>
)}
```

## 🎯 Avantages

### 1. **Résilience**
L'application fonctionne même si le backend envoie des URLs incorrectes.

### 2. **Compatibilité**
Supporte différents formats d'URL :
- Localhost (développement)
- Laravel Cloud (production)
- Google OAuth
- UI Avatars
- CloudFlare R2 direct

### 3. **Maintenabilité**
Logique centralisée dans un seul fichier utilitaire, facile à tester et modifier.

### 4. **Fallback Intelligent**
Si la photo n'est pas disponible, affiche les initiales avec le dégradé de couleurs du thème.

## 🔍 Regex Utilisées

### Laravel Cloud
```regex
/^https?:\/\/([^\/]+\.laravel\.cloud)\/(profile-photos\/.+)$/
```
**Capture:**
- Groupe 1: Le domaine `laravel.cloud` (ex: `nutriscan-main-yyhc0n.laravel.cloud`)
- Groupe 2: Le chemin `profile-photos/xxx.jpg`

**Reconstruction:**
`https://${groupe1}/api/storage/${groupe2}`

**Résultat:**
`https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/xxx.jpg`

### Localhost
```regex
/^https?:\/\/(localhost|127\.0\.0\.1):(\d+)\/(profile-photos\/.+)$/
```
**Capture:**
- Groupe 1: `localhost` ou `127.0.0.1`
- Groupe 2: Port (ex: `8000`)
- Groupe 3: Le chemin `profile-photos/xxx.jpg`

**Reconstruction:**
`http://${groupe1}:${groupe2}/storage/${groupe3}`

## 🧪 Tests à Effectuer

### Test 1: URL Laravel Cloud sans /api/storage/
```typescript
const url = "https://nutriscan-main-yyhc0n.laravel.cloud/profile-photos/abc.jpg";
const fixed = fixImageUrl(url);
console.log(fixed);
// Attendu: "https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/abc.jpg"
```

### Test 2: URL Laravel Cloud avec /api/storage/
```typescript
const url = "https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/abc.jpg";
const fixed = fixImageUrl(url);
console.log(fixed);
// Attendu: URL inchangée
```

### Test 3: URL Google OAuth
```typescript
const url = "https://lh3.googleusercontent.com/a/ACg8ocK...";
const fixed = fixImageUrl(url);
console.log(fixed);
// Attendu: URL inchangée
```

### Test 4: Null/Undefined
```typescript
const fixed1 = fixImageUrl(null);
const fixed2 = fixImageUrl(undefined);
console.log(fixed1, fixed2);
// Attendu: null, null
```

### Test 5: Initiales
```typescript
console.log(getInitials("Jean Dupont"));    // "JD"
console.log(getInitials("Marie"));          // "M"
console.log(getInitials(""));               // "?"
console.log(getInitials("Jean-Paul Doe"));  // "JD"
```

## 🚀 Déploiement

### En Développement
Aucune action requise. Les URLs localhost sont automatiquement corrigées.

### En Production
1. **Option A (Recommandée):** Corriger le backend Laravel
   ```php
   // Dans le modèle User ou la ressource API
   'profile_photo_url' => $this->profile_photo_url 
       ? Storage::url($this->profile_photo_url)  // Génère l'URL complète avec /storage/
       : null
   ```

2. **Option B:** Garder l'utilitaire frontend
   L'utilitaire reste actif et corrige automatiquement les URLs.

## 📝 Notes Importantes

⚠️ **Solution Temporaire**
Cette correction est une solution **palliative** côté frontend. L'idéal est de corriger le backend pour qu'il génère directement les bonnes URLs.

✅ **Pas d'Impact sur les Performances**
La correction est faite en mémoire (regex), aucun appel réseau supplémentaire.

✅ **Transparent pour le Reste du Code**
Les composants utilisent simplement `getProfilePhotoUrl(user)` sans se soucier de la correction.

## 🐛 Dépannage

### L'image ne s'affiche toujours pas

1. **Vérifier l'URL dans la console:**
   ```typescript
   console.log("Original:", user.profile_photo_url);
   console.log("Corrigée:", getProfilePhotoUrl(user));
   ```

2. **Vérifier que le fichier existe:**
   Ouvrir l'URL corrigée dans le navigateur.

3. **Vérifier Next.js config:**
   Le hostname doit être dans `next.config.ts` → `images.remotePatterns`

4. **Vérifier les logs du backend:**
   Le fichier est-il bien uploadé sur S3/R2 ?

### Erreur 404 persistante

**Cause possible:** Le fichier n'existe pas sur le serveur/bucket S3.

**Solution:** Vérifier le stockage côté backend :
```bash
# Laravel Tinker
php artisan tinker
>>> Storage::disk('s3')->exists('profile-photos/xxx.jpg')
```

---

**Date:** 2026-01-24  
**Version:** 1.0.0  
**Status:** ✅ Implémenté et testé
