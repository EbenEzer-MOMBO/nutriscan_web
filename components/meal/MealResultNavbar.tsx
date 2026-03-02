"use client";

import { ArrowLeft, Plus, CalendarBlank, PlusCircle } from "phosphor-react";

interface MealResultNavbarProps {
    onBack: () => void;
    onAddToJournal: () => void;
    mealType: string;
    onMealTypeChange: (type: string) => void;
    isAddingToJournal?: boolean;
    mode?: "scan" | "edit" | "add_manual";
    mealDate?: string;
    onDateChange?: (date: string) => void;
    onAddManually?: () => void;
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
    mode = "scan",
    mealDate,
    onDateChange,
    onAddManually,
}: MealResultNavbarProps) {
    // Déterminer le titre et le texte du bouton selon le mode
    const getTitle = () => {
        switch (mode) {
            case "edit":
                return "Modifier le repas";
            case "add_manual":
                return "Ajouter manuellement";
            case "scan":
            default:
                return "Résultat du scan";
        }
    };

    const getButtonText = () => {
        switch (mode) {
            case "edit":
                return "Mettre à jour";
            case "add_manual":
                return "Ajouter";
            case "scan":
            default:
                return "Ajouter";
        }
    };

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
                            {getTitle()}
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
                            <span className="text-sm">{getButtonText()}</span>
                        </button>
                    </div>

                    {/* Champ de date */}
                    {mealDate && onDateChange && (
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                Date du repas
                            </label>
                            <div className="relative">
                                <CalendarBlank 
                                    size={20} 
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                                    weight="bold" 
                                />
                                <input
                                    type="date"
                                    value={mealDate}
                                    onChange={(e) => onDateChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F7941D] focus:outline-none transition-colors text-gray-900 font-medium"
                                />
                            </div>
                        </div>
                    )}

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

                    {/* Bouton ajout manuel (seulement en mode scan) */}
                    {mode === "scan" && onAddManually && (
                        <div className="mt-4">
                            <button
                                onClick={onAddManually}
                                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#F7941D] hover:text-[#F7941D] transition-all flex items-center justify-center gap-2 font-semibold"
                            >
                                <PlusCircle size={20} weight="bold" />
                                <span>Ajouter un aliment manuellement</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
