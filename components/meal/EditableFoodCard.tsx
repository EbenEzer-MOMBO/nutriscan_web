"use client";

import { useState } from "react";
import { Trash, Check } from "phosphor-react";
import { DetectedFood } from "@/lib/types/mealscan";

interface EditableFoodCardProps {
    food: DetectedFood;
    onQuantityChange: (newQuantity: number) => void;
    onDelete: () => void;
}

const CONFIDENCE_CONFIG = {
    high: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        label: "Haute confiance",
    },
    medium: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        label: "Confiance moyenne",
    },
    low: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        label: "Faible confiance",
    },
};

export default function EditableFoodCard({
    food,
    onQuantityChange,
    onDelete,
}: EditableFoodCardProps) {
    const [quantity, setQuantity] = useState(food.quantity_value);
    const [isEditing, setIsEditing] = useState(false);
    const confidenceConfig = CONFIDENCE_CONFIG[food.confidence];

    // Calculer les valeurs proportionnelles
    const ratio = quantity / food.quantity_value;
    const calculatedNutrition = {
        energy_kcal: Math.round(food.nutrition.energy_kcal * ratio),
        proteins: Math.round(food.nutrition.proteins * ratio * 10) / 10,
        carbohydrates: Math.round(food.nutrition.carbohydrates * ratio * 10) / 10,
        fat: Math.round(food.nutrition.fat * ratio * 10) / 10,
        fiber: Math.round(food.nutrition.fiber * ratio * 10) / 10,
    };

    const handleQuantityChange = (newValue: string) => {
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue) && numValue > 0) {
            setQuantity(numValue);
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        if (quantity !== food.quantity_value) {
            onQuantityChange(quantity);
        }
        setIsEditing(false);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{food.name}</h3>
                    <span
                        className={`inline-block text-xs px-2 py-1 rounded-full border ${confidenceConfig.border} ${confidenceConfig.bg} ${confidenceConfig.text} font-medium`}
                    >
                        {confidenceConfig.label}
                    </span>
                </div>

                <button
                    onClick={onDelete}
                    className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                    title="Supprimer cet aliment"
                >
                    <Trash size={20} weight="bold" />
                </button>
            </div>

            {/* Quantité éditable */}
            <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                    Quantité
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        onBlur={handleBlur}
                        min="0"
                        step={food.quantity_unit === "g" ? "10" : "0.5"}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F7941D] focus:outline-none font-semibold text-gray-900"
                    />
                    <span className="text-gray-600 font-medium min-w-[40px]">{food.quantity_unit}</span>
                    {isEditing && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Check size={16} weight="bold" />
                            <span>Modifié</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Valeurs nutritionnelles */}
            <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-lg font-bold text-[#F7941D]">
                        {calculatedNutrition.energy_kcal}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">kcal</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-lg font-bold text-blue-600">
                        {calculatedNutrition.proteins}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Prot.</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-lg font-bold text-amber-600">
                        {calculatedNutrition.carbohydrates}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Gluc.</p>
                </div>
                <div className="text-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-lg font-bold text-rose-600">
                        {calculatedNutrition.fat}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Lip.</p>
                </div>
            </div>
        </div>
    );
}
