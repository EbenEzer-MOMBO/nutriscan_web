/**
 * Configuration et utilitaires pour Google OAuth
 * Utilise la bibliothèque @react-oauth/google pour l'authentification
 */

/**
 * Initialiser Google OAuth
 * Cette fonction charge le script Google Identity Services
 */
export function initGoogleOAuth(): void {
  if (typeof window === 'undefined') return;

  // Vérifier si le script est déjà chargé
  if (document.getElementById('google-oauth-script')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-oauth-script';
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

/**
 * Configuration Google OAuth
 */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/**
 * Interface pour la réponse Google OAuth
 */
export interface GoogleOAuthResponse {
  credential: string;
  select_by: string;
  clientId: string;
}

/**
 * Décoder le JWT Google pour obtenir les informations utilisateur
 * @param token - Token JWT Google
 * @returns Informations utilisateur décodées
 */
export function decodeGoogleJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur décodage JWT:', error);
    return null;
  }
}

/**
 * Obtenir le token d'accès Google via popup OAuth
 * @returns Promise avec le token d'accès
 */
export function getGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    const client = (window as any).google?.accounts?.oauth2;
    
    if (!client) {
      reject(new Error('Google OAuth client not loaded'));
      return;
    }

    const tokenClient = client.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      callback: (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        resolve(response.access_token);
      },
    });

    tokenClient.requestAccessToken();
  });
}

/**
 * Vérifier si Google OAuth est chargé
 * @returns true si chargé, false sinon
 */
export function isGoogleOAuthLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).google?.accounts?.oauth2;
}

/**
 * Attendre que Google OAuth soit chargé
 * @param timeout - Timeout en ms (défaut: 5000)
 * @returns Promise qui se résout quand Google OAuth est chargé
 */
export function waitForGoogleOAuth(timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGoogleOAuthLoaded()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (isGoogleOAuthLoaded()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error('Google OAuth loading timeout'));
      }
    }, 100);
  });
}
