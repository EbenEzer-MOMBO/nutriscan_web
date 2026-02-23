// Types pour l'API Journal de suivi (JOURNAL_API.md)

import type { ScannedMeal } from './mealscan';

/** Totaux nutritionnels du jour agrégés à partir des repas scannés */
export interface JournalConsumed {
    total_calories: number;
    total_proteins: number;
    total_carbohydrates: number;
    total_fat: number;
    total_meals: number;
}

/** Objectifs quotidiens issus du profil (si existant) */
export interface JournalGoals {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fat: number;
}

/** Statut d'atteinte des objectifs (80 % – 120 % par indicateur) */
export interface JournalGoalStatus {
    calories_reached: boolean;
    proteins_reached: boolean;
    carbs_reached: boolean;
    fat_reached: boolean;
    overall_reached: boolean;
}

/** Réponse GET /api/journal */
export interface JournalResponse {
    success: boolean;
    date: string;
    meals: ScannedMeal[];
    consumed: JournalConsumed;
    goals: JournalGoals | null;
    goal_status: JournalGoalStatus | null;
}

/** Erreur 422 — date invalide */
export interface JournalValidationError {
    message: string;
    errors?: {
        date?: string[];
    };
}

/** Statut objectif pour un jour (vue mensuelle) */
export type JournalDayStatus = 'reached' | 'not_reached' | 'no_data';

/** Réponse GET /api/journal/month — vue mensuelle calendrier */
export interface JournalMonthResponse {
    success: boolean;
    year: number;
    month: number;
    monthly_goal_status: Record<string, JournalDayStatus>;
}
