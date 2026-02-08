"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ForkKnife } from "phosphor-react";
import { ScannedMeal } from "@/lib/types/mealscan";

export default function MealPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [meal, setMeal] = useState<ScannedMeal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMeal();
    }, [id]);

    const loadMeal = async () => {
        try {
            setLoading(true);
            const { getMealDetails } = await import("@/lib/mealscan.service");
            const result = await getMealDetails(parseInt(id));

            if (result.success && result.data) {
                setMeal(result.data);
            } else {
                setError("Repas non trouvé");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F7941D] mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyse du repas en cours...</p>
                </div>
            </div>
        );
    }

    if (error || !meal) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <ForkKnife size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur d'analyse</h2>
                    <p className="text-gray-600 mb-6">{error || "Le repas n'a pas pu être analysé"}</p>
                    <button
                        onClick={() => router.push("/scan")}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold"
                    >
                        Scanner un autre repas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={24} weight="bold" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 flex-1">Analyse du repas</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Image du repas */}
                {meal.image_url && (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={meal.image_url}
                            alt="Repas scanné"
                            className="w-full h-64 object-cover"
                        />
                    </div>
                )}

                {/* Résumé nutritionnel */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé nutritionnel</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-orange-50 rounded-xl">
                            <p className="text-3xl font-bold text-[#F7941D]">{meal.total_calories}</p>
                            <p className="text-sm text-gray-600 mt-1">Calories</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <p className="text-3xl font-bold text-blue-600">{meal.foods_count}</p>
                            <p className="text-sm text-gray-600 mt-1">Aliments</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Protéines</span>
                            <span className="font-semibold">{meal.nutrition_summary.proteins} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Glucides</span>
                            <span className="font-semibold">{meal.nutrition_summary.carbohydrates} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Lipides</span>
                            <span className="font-semibold">{meal.nutrition_summary.fat} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Fibres</span>
                            <span className="font-semibold">{meal.nutrition_summary.fiber} g</span>
                        </div>
                    </div>
                </div>

                {/* Aliments détectés */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Aliments détectés</h2>
                    <div className="space-y-4">
                        {meal.foods_detected.map((food, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-900">{food.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${food.confidence === 'high' ? 'bg-green-100 text-green-700' :
                                            food.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {food.confidence === 'high' ? 'Haute' : food.confidence === 'medium' ? 'Moyenne' : 'Faible'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{food.quantity_display}</p>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <p className="font-semibold">{food.nutrition.energy_kcal}</p>
                                        <p className="text-gray-500">kcal</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <p className="font-semibold">{food.nutrition.proteins}g</p>
                                        <p className="text-gray-500">Protéines</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <p className="font-semibold">{food.nutrition.carbohydrates}g</p>
                                        <p className="text-gray-500">Glucides</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notes d'analyse */}
                {meal.analysis_notes && (
                    <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Analyse</h3>
                        <p className="text-sm text-blue-800">{meal.analysis_notes}</p>
                    </div>
                )}

                {/* Bouton Scanner un autre */}
                <button
                    onClick={() => router.push("/scan")}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    Scanner un autre repas
                </button>
            </div>
        </div>
    );
}
