/**
 * Utilitaires pour la gestion des URLs d'images
 */

/**
 * Corrige les URLs d'images incorrectes du backend
 * @param url - URL de l'image à corriger
 * @returns URL corrigée
 */
export function fixImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Si l'URL contient déjà /storage/ ou /api/storage/, la retourner telle quelle
  if (url.includes('/storage/')) {
    return url;
  }

  // Vérifier si c'est une URL Google (OAuth)
  if (url.includes('googleusercontent.com') || url.includes('google.com')) {
    return url;
  }

  // Vérifier si c'est une URL ui-avatars.com
  if (url.includes('ui-avatars.com')) {
    return url;
  }

  // Corriger les URLs Laravel Cloud sans /storage/
  // Format attendu: https://nutriscan-main-yyhc0n.laravel.cloud/api/storage/profile-photos/xxx.jpg
  const laravelCloudPattern = /^https?:\/\/([^\/]+\.laravel\.cloud)\/(profile-photos\/.+)$/;
  const match = url.match(laravelCloudPattern);
  
  if (match) {
    const [, domain, path] = match;
    // Ajouter /api/storage/ avant le chemin
    return `https://${domain}/api/storage/${path}`;
  }

  // Corriger les URLs localhost sans /storage/
  const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1):(\d+)\/(profile-photos\/.+)$/;
  const localhostMatch = url.match(localhostPattern);
  
  if (localhostMatch) {
    const [, host, port, path] = localhostMatch;
    return `http://${host}:${port}/storage/${path}`;
  }

  // Si aucun pattern ne correspond, retourner l'URL originale
  return url;
}

/**
 * Obtient l'URL de la photo de profil ou génère un avatar avec les initiales
 * @param user - Objet utilisateur
 * @returns URL de la photo de profil corrigée ou null
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
