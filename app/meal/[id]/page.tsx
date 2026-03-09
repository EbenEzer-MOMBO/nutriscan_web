"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ForkKnife, Fire, Cookie, Drop } from "phosphor-react";
import { ScannedMeal, DetectedFood, MealType } from "@/lib/types/mealscan";
import { useMealDetails, useUpdateMeal, useAddManualMeal } from "@/lib/hooks/use-queries";
import MealResultNavbar from "@/components/meal/MealResultNavbar";
import NutrientBar from "@/components/meal/NutrientBar";
import EditableFoodCard from "@/components/meal/EditableFoodCard";

export default function MealPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const idParam = params.id as string;
    const mealId = parseInt(idParam, 10);
    const idValid = !isNaN(mealId) && mealId > 0;

    // Vérifier si on vient de la page /add
    const fromAdd = searchParams.get('from') === 'add';

    // Déterminer le mode: "scan", "edit" ou "add_manual"
    const [mode, setMode] = useState<"scan" | "edit" | "add_manual">("scan");

    const { data: mealResult, isLoading: loading, isError: hasError, error } = useMealDetails(idValid ? mealId : null);
    const updateMealMutation = useUpdateMeal();
    const addManualMealMutation = useAddManualMeal();

    const meal = mealResult?.success ? mealResult.data : null;
    const [foods, setFoods] = useState<DetectedFood[]>([]);
    const [mealType, setMealType] = useState<string>("");
    const [mealDate, setMealDate] = useState<string>("");

    useEffect(() => {
        if (meal) {
            setFoods(meal.foods_detected ?? []);
            
            // Vérifier s'il y a un aliment sélectionné dans sessionStorage
            if (typeof window !== 'undefined') {
                const selectedFoodItem = sessionStorage.getItem('selectedFoodItem');
                if (selectedFoodItem) {
                    try {
                        const foodItem = JSON.parse(selectedFoodItem);
                        console.log("🍴 [MEAL PAGE] Aliment récupéré:", foodItem);
                        
                        // Convertir en DetectedFood
                        const newFood: DetectedFood = {
                            name: foodItem.name,
                            type: foodItem.type,
                            quantity_display: `${foodItem.reference_quantity} ${foodItem.reference_unit}`,
                            quantity_value: foodItem.reference_quantity,
                            quantity_unit: foodItem.reference_unit,
                            estimated_weight_grams: foodItem.type === 'pesable' ? foodItem.reference_quantity : 0,
                            confidence: 'manual' as any,
                            nutrition: foodItem.nutrition_per_reference,
                        };
                        
                        setFoods(prev => [...prev, newFood]);
                        
                        // Nettoyer le sessionStorage
                        sessionStorage.removeItem('selectedFoodItem');
                    } catch (error) {
                        console.error("❌ Erreur parsing foodItem:", error);
                    }
                }
            }
            
            // Déterminer le mode en fonction de la provenance et du meal_type
            if (fromAdd) {
                // Si on vient de /add, toujours en mode scan (ajout avec date modifiable)
                setMode("scan");
                // Date initiale: aujourd'hui (l'utilisateur peut la modifier)
                const today = new Date().toISOString().split('T')[0];
                setMealDate(today);
                // Ne pas définir le meal_type automatiquement
                if (!mealType) {
                    setMealType("");
                }
            } else if (meal.meal_type) {
                // Si meal_type est déjà défini (et on ne vient pas de /add), on est en mode édition
                setMealType(meal.meal_type);
                setMode("edit");
                // Utiliser la date du scan
                if (meal.scanned_at) {
                    const date = new Date(meal.scanned_at);
                    const dateStr = date.toISOString().split('T')[0];
                    setMealDate(dateStr);
                }
            } else {
                // Si meal_type n'est pas défini, c'est un scan récent
                setMode("scan");
                // Extraire la date du scan
                if (meal.scanned_at) {
                    const date = new Date(meal.scanned_at);
                    const dateStr = date.toISOString().split('T')[0];
                    setMealDate(dateStr);
                } else {
                    // Date par défaut: aujourd'hui
                    const today = new Date().toISOString().split('T')[0];
                    setMealDate(today);
                }
            }
        }
    }, [meal, fromAdd]);

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
        if (!mealType || !meal) {
            alert("Veuillez sélectionner un type de repas");
            return;
        }

        if (!mealDate) {
            alert("Veuillez sélectionner une date");
            return;
        }

        try {
            if (fromAdd) {
                // Mode ajout depuis /add : créer un nouveau repas avec add-manual
                console.log("📝 [MEAL PAGE] Ajout d'un nouveau repas depuis /add");
                
                // Générer un nom pour le repas basé sur les aliments
                const mealName = foods.length > 0 
                    ? foods.map(f => f.name).slice(0, 3).join(", ") + (foods.length > 3 ? "..." : "")
                    : "Repas";
                
                await addManualMealMutation.mutateAsync({
                    meal_name: mealName,
                    meal_type: mealType as MealType,
                    notes: meal.notes || undefined,
                    // Copier l'image du repas source
                    ...(meal.image_path && { image_path: meal.image_path }),
                    ...(meal.image_url && { image_url: meal.image_url }),
                    // Utiliser la date sélectionnée par l'utilisateur
                    scanned_at: mealDate,
                    foods: foods.map(f => ({
                        name: f.name,
                        quantity: f.quantity_value,
                        unit: f.quantity_unit,
                        nutrition: {
                            energy_kcal: f.nutrition.energy_kcal,
                            proteins: f.nutrition.proteins,
                            carbohydrates: f.nutrition.carbohydrates,
                            sugars: f.nutrition.sugars,
                            fat: f.nutrition.fat,
                            saturated_fat: f.nutrition.saturated_fat,
                            fiber: f.nutrition.fiber,
                            sodium: f.nutrition.sodium,
                        }
                    }))
                });
                
                alert("Repas ajouté au journal avec succès !");
            } else {
                // Mode édition ou scan : mettre à jour le repas existant
                console.log("🔄 [MEAL PAGE] Mise à jour du repas existant");
                
                await updateMealMutation.mutateAsync({
                    id: meal.id,
                    data: {
                        meal_type: mealType as MealType,
                        foods_detected: foods,
                        ...(meal.notes != null && meal.notes !== "" && { notes: meal.notes }),
                    },
                });
                
                const actionText = mode === "edit" ? "mis à jour" : "ajouté au journal";
                alert(`Repas ${actionText} avec succès !`);
            }
            
            router.push("/journal");
        } catch (err) {
            console.error("❌ [MEAL PAGE] Erreur:", err);
            alert(err instanceof Error ? err.message : "Erreur lors de l'opération");
        }
    };

    const handleAddManually = () => {
        router.push(`/add-manual?returnTo=/meal/${mealId}`);
    };

    const isAddingToJournal = updateMealMutation.isPending || addManualMealMutation.isPending;

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

    if (hasError || !meal) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <ForkKnife size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur d'analyse</h2>
                    <p className="text-gray-600 mb-6">{error instanceof Error ? error.message : "Le repas n'a pas pu être chargé"}</p>
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
                mode={mode}
                mealDate={mealDate}
                onDateChange={setMealDate}
                onAddManually={handleAddManually}
            />

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 space-y-6">
                {/* Image du repas ou icône de remplacement */}
                {meal.image_url ? (
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
                ) : (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                        <div className="w-full h-72 flex flex-col items-center justify-center">
                            <ForkKnife size={80} weight="duotone" className="text-[#F7941D] mb-4" />
                            <span className="text-sm font-semibold text-gray-600">
                                Repas ajouté manuellement
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
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
