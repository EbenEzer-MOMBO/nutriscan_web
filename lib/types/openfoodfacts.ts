// Types pour l'API OpenFoodFacts

export interface Nutriments {
    energy_kcal: number;
    energy_kj: number;
    proteins: number;
    carbohydrates: number;
    sugars: number;
    fat: number;
    saturated_fat: number;
    fiber: number;
    sodium: number;
    salt: number;
}

export interface ScannedProduct {
    id: number;
    barcode: string;
    product_name: string;
    brands: string;
    quantity: string;
    image_url: string;
    image_small_url: string;
    nutriscore_grade: string;
    nutriments: Nutriments;
    ingredients_text: string;
    allergens: string;
    allergens_tags: string[];
    labels: string;
    labels_tags: string[];
    categories: string;
    serving_size: string;
    nova_group: number;
    ecoscore_grade: string;
    scanned_at: string;
    created_at: string;
}

export interface ScanResponse {
    success: boolean;
    message: string;
    data?: ScannedProduct;
    barcode?: string;
}

export interface ScanHistoryResponse {
    success: boolean;
    data: ScannedProduct[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface ScanStatistics {
    total_scans: number;
    scans_this_month: number;
    scans_this_week: number;
    scans_today: number;
}

export interface ScanStatisticsResponse {
    success: boolean;
    data: ScanStatistics;
}
