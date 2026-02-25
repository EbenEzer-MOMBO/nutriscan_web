/**
 * Hook personnalisé pour gérer l'authentification
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { User, getUser, getAuthToken, isAuthenticated, logout } from '@/lib/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Charger les données d'authentification au montage
    const loadAuthData = () => {
      const currentUser = getUser();
      const currentToken = getAuthToken();
      
      setUser(currentUser);
      setToken(currentToken);
      setLoading(false);
    };

    loadAuthData();

    // Écouter les changements de localStorage (pour synchroniser entre onglets)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'auth_token') {
        loadAuthData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Vider le cache de toutes les requêtes
    queryClient.clear();
    
    // Déconnexion (supprime les données localStorage)
    logout();
    
    // Mettre à jour l'état local
    setUser(null);
    setToken(null);
    
    // Rediriger vers la page de login
    router.push('/login');
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: isAuthenticated(),
    logout: handleLogout,
  };
}

/**
 * Hook pour protéger les routes (rediriger vers login si non authentifié)
 */
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
}
