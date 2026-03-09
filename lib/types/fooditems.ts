export interface FoodItemNutrition {
    energy_kcal: number;
    proteins: number;
    carbohydrates: number;
    sugars: number;
    fat: number;
    saturated_fat: number;
    fiber: number;
    sodium: number;
}

export interface FoodItem {
    id?: number;
    user_id?: number;
    name: string;
    type: 'pesable' | 'comptable';
    source?: 'scan' | 'manual';
    reference_quantity: number;
    reference_unit: string;
    nutrition_per_reference: FoodItemNutrition;
    usage_count?: number;
    last_used_at?: string;
    original_meal_id?: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AllFoodItem {
    name: string;
    type: 'pesable' | 'comptable';
    reference_quantity: number;
    reference_unit: string;
    nutrition_per_reference: FoodItemNutrition;
    total_usage: number;
}

export interface FoodItemsResponse {
    success: boolean;
    data: FoodItem[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface AllFoodItemsResponse {
    success: boolean;
    data: AllFoodItem[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface FoodItemDetailResponse {
    success: boolean;
    data: FoodItem;
}
