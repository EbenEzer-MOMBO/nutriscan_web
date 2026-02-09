import {
    UserProfile,
    CreateProfileData,
    UpdateProfileData,
    ProfileResponse
} from './types/profile';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export async function getProfile(): Promise<ProfileResponse> {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return {
                success: false,
                message: 'Non authentifié'
            };
        }

        const response = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Erreur lors de la récupération du profil'
            };
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('Erreur getProfile:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erreur réseau'
        };
    }
}

/**
 * Créer un nouveau profil
 */
export async function createProfile(profileData: CreateProfileData): Promise<ProfileResponse> {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return {
                success: false,
                message: 'Non authentifié'
            };
        }

        const response = await fetch(`${API_URL}/profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Erreur lors de la création du profil'
            };
        }

        return {
            success: true,
            data: data.data,
            message: 'Profil créé avec succès'
        };
    } catch (error) {
        console.error('Erreur createProfile:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erreur réseau'
        };
    }
}

/**
 * Mettre à jour le profil existant
 */
export async function updateProfile(profileData: UpdateProfileData): Promise<ProfileResponse> {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return {
                success: false,
                message: 'Non authentifié'
            };
        }

        const response = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Erreur lors de la mise à jour du profil'
            };
        }

        return {
            success: true,
            data: data.data,
            message: 'Profil mis à jour avec succès'
        };
    } catch (error) {
        console.error('Erreur updateProfile:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erreur réseau'
        };
    }
}

/**
 * Supprimer le profil
 */
export async function deleteProfile(): Promise<{ success: boolean; message: string }> {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return {
                success: false,
                message: 'Non authentifié'
            };
        }

        const response = await fetch(`${API_URL}/profile`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Erreur lors de la suppression du profil'
            };
        }

        return {
            success: true,
            message: data.message || 'Profil supprimé avec succès'
        };
    } catch (error) {
        console.error('Erreur deleteProfile:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erreur réseau'
        };
    }
}

/**
 * Recalculer les objectifs nutritionnels
 */
export async function recalculateTargets(): Promise<ProfileResponse> {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return {
                success: false,
                message: 'Non authentifié'
            };
        }

        const response = await fetch(`${API_URL}/profile/recalculate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Erreur lors du recalcul des objectifs'
            };
        }

        return {
            success: true,
            data: data.data,
            message: 'Objectifs recalculés avec succès'
        };
    } catch (error) {
        console.error('Erreur recalculateTargets:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erreur réseau'
        };
    }
}
