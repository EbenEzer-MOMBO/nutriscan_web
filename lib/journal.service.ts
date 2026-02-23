/**
 * Service Journal de suivi - NutriScan
 * Consulte le journal nutritionnel du jour ou d'une date donnée (repas, totaux, objectifs).
 * @see JOURNAL_API.md
 */

import type {
    JournalResponse,
    JournalMonthResponse,
    JournalValidationError,
} from './types/journal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

/**
 * Récupère le journal de suivi pour la date demandée.
 * Sans paramètre : journal du jour. Avec date : journal au format YYYY-MM-DD.
 *
 * @param date - Date au format YYYY-MM-DD (optionnel, défaut : jour courant)
 * @returns Journal (meals, consumed, goals, goal_status)
 * @throws Erreur si non authentifié, date invalide (422) ou erreur réseau
 */
export async function getJournal(date?: string): Promise<JournalResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams();
    if (date) params.set('date', date);
    const query = params.toString();
    const url = query ? `${API_BASE_URL}/journal?${query}` : `${API_BASE_URL}/journal`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 422) {
            const err = data as JournalValidationError;
            const msg = err.errors?.date?.[0] ?? err.message ?? 'La date doit être au format AAAA-MM-JJ.';
            throw new Error(msg);
        }
        if (response.status === 401) {
            throw new Error('Session expirée ou invalide. Veuillez vous reconnecter.');
        }
        throw new Error((data as { message?: string }).message ?? 'Erreur lors de la récupération du journal.');
    }

    return data as JournalResponse;
}

/**
 * Récupère le statut objectif par jour pour un mois (vue calendrier).
 * Chaque date a une valeur : "reached" | "not_reached" | "no_data".
 *
 * @param year - Année (ex. 2026). Défaut : année courante.
 * @param month - Mois 1–12. Défaut : mois courant.
 * @returns monthly_goal_status[YYYY-MM-DD] par jour du mois
 * @throws Erreur si non authentifié ou erreur réseau
 */
export async function getJournalMonth(
    year?: number,
    month?: number
): Promise<JournalMonthResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
    }

    const params = new URLSearchParams();
    if (year != null) params.set('year', String(year));
    if (month != null) params.set('month', String(month));
    const query = params.toString();
    const url = query ? `${API_BASE_URL}/journal/month?${query}` : `${API_BASE_URL}/journal/month`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Session expirée ou invalide. Veuillez vous reconnecter.');
        }
        throw new Error(
            (data as { message?: string }).message ??
                'Erreur lors de la récupération du calendrier mensuel.'
        );
    }

    return data as JournalMonthResponse;
}
