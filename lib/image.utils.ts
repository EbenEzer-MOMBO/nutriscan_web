/**
 * Utilitaires pour la gestion des URLs d'images
 */

/**
 * Corrige les URLs d'images incorrectes du backend (si nécessaire)
 * @param url - URL de l'image à corriger
 * @returns URL corrigée ou originale
 */
export function fixImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Le backend envoie maintenant les URLs correctes directement
  // Format production: https://fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud/profile-photos/xxx.jpg
  // Format local: http://localhost:8000/storage/profile-photos/xxx.jpg
  
  // Retourner l'URL telle quelle - plus besoin de correction
  return url;
}

/**
 * Obtient l'URL de la photo de profil
 * @param user - Objet utilisateur
 * @returns URL de la photo de profil ou null
 */
export function getProfilePhotoUrl(user: {
  profile_photo_url?: string | null;
  name?: string;
}): string | null {
  if (!user.profile_photo_url) {
    return null;
  }

  return fixImageUrl(user.profile_photo_url);
}

/**
 * Génère les initiales à partir d'un nom
 * @param name - Nom complet
 * @returns Initiales (1 ou 2 lettres)
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === '') return '?';
  
  const parts = name.trim().split(' ').filter(Boolean);
  
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
