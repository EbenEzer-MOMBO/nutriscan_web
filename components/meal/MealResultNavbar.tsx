"use client";

import { ArrowLeft, Plus } from "phosphor-react";

interface MealResultNavbarProps {
    onBack: () => void;
    onAddToJournal: () => void;
    mealType: string;
    onMealTypeChange: (type: string) => void;
    isAddingToJournal?: boolean;
}

const MEAL_TYPES = [
    { value: "breakfast", label: "Petit-déjeuner", emoji: "🌅" },
    { value: "lunch", label: "Déjeuner", emoji: "☀️" },
    { value: "dinner", label: "Dîner", emoji: "🌙" },
    { value: "snack", label: "Collation", emoji: "🍎" },
];

export default function MealResultNavbar({
    onBack,
    onAddToJournal,
    mealType,
    onMealTypeChange,
    isAddingToJournal = false,
}: MealResultNavbarProps) {
    return (
        <div className="sticky top-0 z-20 bg-gradient-to-b from-white via-white to-transparent backdrop-blur-sm pb-4">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    {/* Header avec boutons */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={24} weight="bold" className="text-gray-900" />
                        </button>

                        <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">
                            Résultat du scan
                        </h1>

                        <button
                            onClick={onAddToJournal}
                            disabled={!mealType || isAddingToJournal}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${!mealType
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white hover:shadow-lg"
                                }`}
                        >
                            <Plus size={20} weight="bold" />
                            <span className="text-sm">Ajouter</span>
                        </button>
                    </div>

                    {/* Sélecteur de type de repas */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                            Type de repas *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {MEAL_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => onMealTypeChange(type.value)}
                                    className={`p-3 rounded-xl border-2 transition-all ${mealType === type.value
                                            ? "border-[#F7941D] bg-orange-50"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{type.emoji}</div>
                                    <div
                                        className={`text-xs font-medium ${mealType === type.value ? "text-[#F7941D]" : "text-gray-600"
                                            }`}
                                    >
                                        {type.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
