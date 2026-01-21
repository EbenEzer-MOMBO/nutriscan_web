/**
 * Service d'authentification Nutriscan
 * Gère l'authentification avec Google et Apple via l'API backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_photo_url: string;
  provider: 'google' | 'apple';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

/**
 * Authentifier un utilisateur avec Google
 * @param accessToken - Token d'accès Google obtenu via OAuth
 * @returns Réponse d'authentification avec user et token
 */
export async function loginWithGoogle(accessToken: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la connexion avec Google');
    }

    // Stocker le token et les infos utilisateur
    if (data.success && data.data) {
      storeAuthData(data.data.token, data.data.user);
    }

    return data;
  } catch (error) {
    console.error('Erreur loginWithGoogle:', error);
    return {
      success: false,
      message: 'Erreur lors de la connexion avec Google',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Authentifier un utilisateur avec Apple
 * @param idToken - ID Token Apple obtenu via OAuth
 * @param user - Informations utilisateur (uniquement lors de la première connexion)
 * @returns Réponse d'authentification avec user et token
 */
export async function loginWithApple(
  idToken: string, 
  user?: { name?: { firstName?: string; lastName?: string }; email?: string }
): Promise<AuthResponse> {
  try {
    const body: any = {
      id_token: idToken,
    };

    // Ajouter les informations utilisateur si disponibles (première connexion)
    if (user && (user.name || user.email)) {
      body.user = user;
    }

    const response = await fetch(`${API_BASE_URL}/auth/apple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la connexion avec Apple');
    }

    // Stocker le token et les infos utilisateur
    if (data.success && data.data) {
      storeAuthData(data.data.token, data.data.user);
    }

    return data;
  } catch (error) {
    console.error('Erreur loginWithApple:', error);
    return {
      success: false,
      message: 'Erreur lors de la connexion avec Apple',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Stocker les données d'authentification dans le localStorage et les cookies
 * @param token - Token d'authentification
 * @param user - Informations utilisateur
 */
function storeAuthData(token: string, user: User): void {
  if (typeof window !== 'undefined') {
    // Stocker dans localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Stocker aussi dans les cookies pour le middleware
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }
}

/**
 * Récupérer le token d'authentification
 * @returns Token d'authentification ou null
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Récupérer les informations utilisateur
 * @returns Informations utilisateur ou null
 */
export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Erreur parsing user:', error);
        return null;
      }
    }
  }
  return null;
}

/**
 * Vérifier si l'utilisateur est authentifié
 * @returns true si authentifié, false sinon
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null && getUser() !== null;
}

/**
 * Déconnecter l'utilisateur
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Supprimer aussi le cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

/**
 * Récupérer le profil utilisateur depuis l'API
 * @returns Informations utilisateur ou null
 */
export async function fetchUserProfile(): Promise<User | null> {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      // Mettre à jour le localStorage avec les nouvelles infos
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('Erreur fetchUserProfile:', error);
    return null;
  }
}
