// Types pour l'API de scan de repas

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type FoodType = 'pesable' | 'comptable';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface FoodNutrition {
    energy_kcal: number;
    proteins: number;
    carbohydrates: number;
    sugars: number;
    fat: number;
    saturated_fat: number;
    fiber: number;
    sodium: number;
}

export interface DetectedFood {
    name: string;
    type: FoodType;
    quantity_display: string;
    quantity_value: number;
    quantity_unit: string;
    estimated_weight_grams: number;
    confidence: ConfidenceLevel;
    nutrition: FoodNutrition;
}

export interface ScannedMeal {
    id: number;
    image_url: string;
    scanned_at: string;
    meal_type: MealType | null;
    notes: string | null;
    foods_detected: DetectedFood[];
    nutrition_summary: FoodNutrition;
    total_calories: number;
    foods_count: number;
    analysis_notes: string | null;
}

export interface ScanMealResponse {
    success: boolean;
    message: string;
    data?: ScannedMeal;
}

export interface MealHistoryItem {
    id: number;
    image_url: string;
    scanned_at: string;
    meal_type: MealType | null;
    total_calories: number;
    foods_count: number;
}

export interface MealHistoryResponse {
    success: boolean;
    data: MealHistoryItem[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface DailyStatistics {
    total_meals: number;
    total_calories: number;
    total_proteins: number;
    total_carbohydrates: number;
    total_fat: number;
    average_calories_per_meal: number;
}

export interface DailyStatisticsResponse {
    success: boolean;
    date: string;
    data: DailyStatistics;
}

export interface WeeklyStatistics extends DailyStatistics {
    days_count: number;
}

export interface WeeklyStatisticsResponse {
    success: boolean;
    period: {
        start_date: string;
        end_date: string;
    };
    data: WeeklyStatistics;
}

export interface UpdateMealData {
    foods_detected?: DetectedFood[];
    meal_type?: MealType;
    notes?: string;
}
