import {
    ScanMealResponse,
    MealHistoryResponse,
    DailyStatisticsResponse,
    WeeklyStatisticsResponse,
    ScannedMeal,
    UpdateMealData,
    MealType,
} from './types/mealscan';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Récupère le token d'authentification depuis le localStorage
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

/**
 * Scanner un repas via une image
 */
export async function scanMeal(
    image: File | Blob,
    mealType?: MealType,
    notes?: string
): Promise<ScanMealResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    console.log('🔍 [MEAL API] Scan du repas...');
    console.log('📊 [MEAL API] Détails de la requête:', {
        imageSize: image.size,
        imageType: image.type,
        mealType,
        notes,
        hasToken: !!token
    });

    try {
        const formData = new FormData();
        formData.append('image', image);
        if (mealType) formData.append('meal_type', mealType);
        if (notes) formData.append('notes', notes);

        console.log('📤 [MEAL API] FormData créé, envoi vers:', `${API_BASE_URL}/meals/scan`);

        const response = await fetch(`${API_BASE_URL}/meals/scan`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        console.log('📥 [MEAL API] Réponse reçue:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        const data = await response.json();
        console.log('📄 [MEAL API] Données de la réponse:', data);

        if (!response.ok) {
            console.error('❌ [MEAL API] Erreur de scan:', {
                status: response.status,
                data
            });

            // Afficher les erreurs de validation si disponibles
            if (data.errors) {
                console.error('❌ [MEAL API] Erreurs de validation:', data.errors);
            }

            throw new Error(data.message || 'Erreur lors du scan du repas');
        }

        console.log('✅ [MEAL API] Repas scanné:', data.data?.foods_count, 'aliments détectés');
        return data;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur réseau:', error);
        throw error;
    }
}

export interface ManualMealFood {
    name: string;
    quantity: number;
    unit: string;
    nutrition: {
        energy_kcal: number;
        proteins: number;
        carbohydrates: number;
        fat: number;
        sugars?: number;
        saturated_fat?: number;
        fiber?: number;
        sodium?: number;
    };
}

export interface AddManualMealData {
    meal_name: string;
    meal_type?: MealType;
    notes?: string;
    foods: ManualMealFood[];
}

/**
 * Ajouter un repas manuellement (sans scan d'image)
 */
export async function addManualMeal(data: AddManualMealData): Promise<ScanMealResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/meals/add-manual`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Erreur lors de l\'ajout du repas manuel');
        }

        return responseData;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur ajout manuel:', error);
        throw error;
    }
}

/**
 * Récupérer l'historique des repas
 */
export async function getMealHistory(
    page: number = 1,
    perPage: number = 20,
    mealType?: MealType,
    startDate?: string,
    endDate?: string
): Promise<MealHistoryResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });

    if (mealType) params.append('meal_type', mealType);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    try {
        const response = await fetch(
            `${API_BASE_URL}/meals/history?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération de l\'historique');
        }

        return data;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur historique:', error);
        throw error;
    }
}

/**
 * Récupérer les détails d'un repas
 */
export async function getMealDetails(id: number): Promise<ScanMealResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération du repas');
        }

        return data;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur détails:', error);
        throw error;
    }
}

/**
 * Mettre à jour un repas
 */
export async function updateMeal(
    id: number,
    updateData: UpdateMealData
): Promise<ScanMealResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la mise à jour du repas');
        }

        return data;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur mise à jour:', error);
        throw error;
    }
}

/**
 * Supprimer un repas
 */
export async function deleteMeal(id: number): Promise<{ success: boolean; message: string }> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la suppression du repas');
        }

        return data;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur suppression:', error);
        throw error;
    }
}

/**
 * Récupérer les statistiques quotidiennes
 */
export async function getDailyStatistics(date?: string): Promise<DailyStatisticsResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams();
    if (date) params.append('date', date);

    try {
        const response = await fetch(
            `${API_BASE_URL}/meals/statistics/daily?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
        }

        return data;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur statistiques:', error);
        throw error;
    }
}

/**
 * Récupérer les statistiques hebdomadaires
 */
export async function getWeeklyStatistics(
    startDate?: string,
    endDate?: string
): Promise<WeeklyStatisticsResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    try {
        const response = await fetch(
            `${API_BASE_URL}/meals/statistics/weekly?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
        }

        return data;
    } catch (error) {
        console.error('❌ [MEAL API] Erreur statistiques hebdomadaires:', error);
        throw error;
    }
}
