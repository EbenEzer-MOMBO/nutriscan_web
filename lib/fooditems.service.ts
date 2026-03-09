import type {
    FoodItemsResponse,
    AllFoodItemsResponse,
    FoodItemDetailResponse,
} from './types/fooditems';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Obtenir le token d'authentification
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

/**
 * Récupérer tous les aliments (tous utilisateurs)
 */
export async function getAllFoodItems(
    page = 1,
    perPage = 50,
    search?: string
): Promise<AllFoodItemsResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams({
        per_page: perPage.toString(),
        ...(page && { page: page.toString() }),
        ...(search && { search }),
    });

    try {
        const response = await fetch(`${API_BASE_URL}/food-items/all?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération des aliments');
        }

        return data as AllFoodItemsResponse;
    } catch (error) {
        console.error('❌ [FOOD ITEMS API] Erreur:', error);
        throw error;
    }
}

/**
 * Récupérer les aliments personnels
 */
export async function getFoodItems(
    page = 1,
    perPage = 20,
    search?: string,
    source?: 'scan' | 'manual'
): Promise<FoodItemsResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams({
        per_page: perPage.toString(),
        ...(page && { page: page.toString() }),
        ...(search && { search }),
        ...(source && { source }),
    });

    try {
        const response = await fetch(`${API_BASE_URL}/food-items?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération des aliments');
        }

        return data as FoodItemsResponse;
    } catch (error) {
        console.error('❌ [FOOD ITEMS API] Erreur:', error);
        throw error;
    }
}

/**
 * Récupérer le détail d'un aliment
 */
export async function getFoodItemDetail(id: number): Promise<FoodItemDetailResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/food-items/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération de l\'aliment');
        }

        return data as FoodItemDetailResponse;
    } catch (error) {
        console.error('❌ [FOOD ITEMS API] Erreur:', error);
        throw error;
    }
}
