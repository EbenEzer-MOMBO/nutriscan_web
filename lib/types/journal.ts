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

/** Statut individuel pour un indicateur nutritionnel */
export type GoalStatusValue = 'reached' | 'partially_reached' | 'not_reached';

/** Statut d'atteinte des objectifs par indicateur (nouveau format API) */
export interface JournalGoalStatus {
    calories_reached: GoalStatusValue;
    proteins_reached: GoalStatusValue;
    carbs_reached: GoalStatusValue;
    fat_reached: GoalStatusValue;
    overall_reached: GoalStatusValue;
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
export type JournalDayStatus = 'reached' | 'partially_reached' | 'not_reached' | 'no_data';

/** Réponse GET /api/journal/month — vue mensuelle calendrier */
export interface JournalMonthResponse {
    success: boolean;
    year: number;
    month: number;
    monthly_goal_status: Record<string, JournalDayStatus>;
}
