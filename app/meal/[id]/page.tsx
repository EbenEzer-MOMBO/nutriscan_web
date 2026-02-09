"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ForkKnife, Fire, Cookie, Drop } from "phosphor-react";
import { ScannedMeal, DetectedFood } from "@/lib/types/mealscan";
import MealResultNavbar from "@/components/meal/MealResultNavbar";
import NutrientBar from "@/components/meal/NutrientBar";
import EditableFoodCard from "@/components/meal/EditableFoodCard";

export default function MealPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [meal, setMeal] = useState<ScannedMeal | null>(null);
    const [foods, setFoods] = useState<DetectedFood[]>([]);
    const [mealType, setMealType] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingToJournal, setIsAddingToJournal] = useState(false);

    const loadMeal = useCallback(async () => {
        try {
            setLoading(true);
            const { getMealDetails } = await import("@/lib/mealscan.service");
            const result = await getMealDetails(parseInt(id));

            if (result.success && result.data) {
                setMeal(result.data);
                setFoods(result.data.foods_detected);
                // Pré-remplir le type de repas si disponible
                if (result.data.meal_type) {
                    setMealType(result.data.meal_type);
                }
            } else {
                setError("Repas non trouvé");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadMeal();
    }, [loadMeal]);

    // Recalculer le résumé nutritionnel basé sur les aliments actuels
    const calculateNutritionSummary = () => {
        return foods.reduce(
            (acc, food) => ({
                energy_kcal: acc.energy_kcal + food.nutrition.energy_kcal,
                proteins: acc.proteins + food.nutrition.proteins,
                carbohydrates: acc.carbohydrates + food.nutrition.carbohydrates,
                fat: acc.fat + food.nutrition.fat,
                fiber: acc.fiber + food.nutrition.fiber,
            }),
            { energy_kcal: 0, proteins: 0, carbohydrates: 0, fat: 0, fiber: 0 }
        );
    };

    const nutritionSummary = calculateNutritionSummary();
    const totalCalories = nutritionSummary.energy_kcal;

    const handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedFoods = [...foods];
        const food = updatedFoods[index];
        const ratio = newQuantity / food.quantity_value;

        // Recalculer les valeurs nutritionnelles
        updatedFoods[index] = {
            ...food,
            quantity_value: newQuantity,
            nutrition: {
                energy_kcal: Math.round(food.nutrition.energy_kcal * ratio),
                proteins: Math.round(food.nutrition.proteins * ratio * 10) / 10,
                carbohydrates: Math.round(food.nutrition.carbohydrates * ratio * 10) / 10,
                sugars: Math.round(food.nutrition.sugars * ratio * 10) / 10,
                fat: Math.round(food.nutrition.fat * ratio * 10) / 10,
                saturated_fat: Math.round(food.nutrition.saturated_fat * ratio * 10) / 10,
                fiber: Math.round(food.nutrition.fiber * ratio * 10) / 10,
                sodium: Math.round(food.nutrition.sodium * ratio * 10) / 10,
            },
        };

        setFoods(updatedFoods);
    };

    const handleDeleteFood = (index: number) => {
        const updatedFoods = foods.filter((_, i) => i !== index);
        setFoods(updatedFoods);
    };

    const handleAddToJournal = async () => {
        if (!mealType) {
            alert("Veuillez sélectionner un type de repas");
            return;
        }

        setIsAddingToJournal(true);
        try {
            // TODO: Implémenter l'ajout au journal
            console.log("Ajout au journal:", { mealType, foods, nutritionSummary });

            // Simuler un délai
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert("Repas ajouté au journal avec succès !");
            router.push("/journal");
        } catch (error) {
            console.error("Erreur lors de l'ajout au journal:", error);
            alert("Erreur lors de l'ajout au journal");
        } finally {
            setIsAddingToJournal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F7941D] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du repas...</p>
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
                    <p className="text-gray-600 mb-6">{error || "Le repas n'a pas pu être chargé"}</p>
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-8">
            {/* Navbar */}
            <MealResultNavbar
                onBack={() => router.back()}
                onAddToJournal={handleAddToJournal}
                mealType={mealType}
                onMealTypeChange={setMealType}
                isAddingToJournal={isAddingToJournal}
            />

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 space-y-6">
                {/* Image du repas */}
                {meal.image_url && (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={meal.image_url}
                            alt="Repas scanné"
                            className="w-full h-72 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-sm font-semibold text-gray-900">
                                {foods.length} aliment{foods.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                )}

                {/* Résumé nutritionnel */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Fire size={24} weight="fill" className="text-[#F7941D]" />
                        Résumé nutritionnel
                    </h2>

                    {/* Calories */}
                    <div className="text-center mb-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                        <p className="text-5xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent">
                            {totalCalories}
                        </p>
                        <p className="text-sm text-gray-600 mt-2 font-medium">Calories totales</p>
                    </div>

                    {/* Macronutriments avec barres */}
                    <div className="space-y-4">
                        <NutrientBar
                            label="Protéines"
                            value={Math.round(nutritionSummary.proteins * 10) / 10}
                            unit="g"
                            color="protein"
                            maxValue={150}
                        />
                        <NutrientBar
                            label="Glucides"
                            value={Math.round(nutritionSummary.carbohydrates * 10) / 10}
                            unit="g"
                            color="carbs"
                            maxValue={300}
                        />
                        <NutrientBar
                            label="Lipides"
                            value={Math.round(nutritionSummary.fat * 10) / 10}
                            unit="g"
                            color="fat"
                            maxValue={100}
                        />
                    </div>

                    {/* Fibres */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Drop size={16} className="text-green-600" />
                            Fibres
                        </span>
                        <span className="text-sm font-bold text-green-700">
                            {Math.round(nutritionSummary.fiber * 10) / 10}g
                        </span>
                    </div>
                </div>

                {/* Aliments détectés */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Cookie size={24} weight="fill" className="text-[#17a2b8]" />
                        Aliments détectés
                    </h2>
                    <div className="space-y-4">
                        {foods.map((food, index) => (
                            <EditableFoodCard
                                key={index}
                                food={food}
                                onQuantityChange={(newQuantity) => handleQuantityChange(index, newQuantity)}
                                onDelete={() => handleDeleteFood(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Notes d'analyse */}
                {meal.analysis_notes && (
                    <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Analyse</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">{meal.analysis_notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
