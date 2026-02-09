// Types pour l'API de profils nutritionnels

export type Gender = 'male' | 'female';
export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph';
export type Goal = 'bulk' | 'cut' | 'recomp' | 'maintain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface DailyTargets {
    calories: number;
    proteins: number;
    carbs: number;
    fat: number;
}

export interface UserProfile {
    id: number;
    user_id: number;
    gender: Gender;
    age: number;
    weight: number;
    height: number;
    bmi: number;
    bmi_category: BMICategory;
    body_type: BodyType;
    goal: Goal;
    activity_level: ActivityLevel;
    daily_targets: DailyTargets;
    target_weight: number | null;
    weight_difference: number | null;
    dietary_preferences: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface CreateProfileData {
    gender: Gender;
    age: number;
    weight: number;
    height: number;
    body_type: BodyType;
    goal: Goal;
    activity_level: ActivityLevel;
    target_weight?: number;
    dietary_preferences?: string[];
}

export interface UpdateProfileData {
    gender?: Gender;
    age?: number;
    weight?: number;
    height?: number;
    body_type?: BodyType;
    goal?: Goal;
    activity_level?: ActivityLevel;
    target_weight?: number;
    dietary_preferences?: string[];
}

export interface ProfileResponse {
    success: boolean;
    data?: UserProfile;
    message?: string;
}
