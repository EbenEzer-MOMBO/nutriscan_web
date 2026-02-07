import { ScanResponse, ScanHistoryResponse, ScanStatisticsResponse } from './types/openfoodfacts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Récupère le token d'authentification depuis le localStorage
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

/**
 * Scanner un produit via son code-barres
 */
export async function scanProduct(barcode: string): Promise<ScanResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    console.log('🔍 [API] Scan du produit:', barcode);

    try {
        const response = await fetch(`${API_BASE_URL}/products/scan`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ barcode }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ [API] Erreur de scan:', data);
            throw new Error(data.message || 'Erreur lors du scan du produit');
        }

        console.log('✅ [API] Produit scanné:', data.data?.product_name);
        return data;
    } catch (error) {
        console.error('❌ [API] Erreur réseau:', error);
        throw error;
    }
}

/**
 * Récupérer l'historique des scans
 */
export async function getScanHistory(
    page: number = 1,
    perPage: number = 20,
    search?: string
): Promise<ScanHistoryResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });

    if (search) {
        params.append('search', search);
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/products/scan-history?${params.toString()}`,
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
        console.error('❌ [API] Erreur historique:', error);
        throw error;
    }
}

/**
 * Supprimer un produit de l'historique
 */
export async function deleteScanHistoryItem(id: number): Promise<{ success: boolean; message: string }> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/scan-history/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la suppression');
        }

        return data;
    } catch (error) {
        console.error('❌ [API] Erreur suppression:', error);
        throw error;
    }
}

/**
 * Vider tout l'historique
 */
export async function clearScanHistory(): Promise<{ success: boolean; message: string }> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/scan-history`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors du vidage de l\'historique');
        }

        return data;
    } catch (error) {
        console.error('❌ [API] Erreur vidage historique:', error);
        throw error;
    }
}

/**
 * Récupérer les statistiques de scan
 */
export async function getScanStatistics(): Promise<ScanStatisticsResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/scan-statistics`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
        }

        return data;
    } catch (error) {
        console.error('❌ [API] Erreur statistiques:', error);
        throw error;
    }
}
