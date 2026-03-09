"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForkKnife, Fire, Drop, Plus, Trash } from "phosphor-react";
import MealResultNavbar from "@/components/meal/MealResultNavbar";
import NutrientBar from "@/components/meal/NutrientBar";
import EditableFoodCard from "@/components/meal/EditableFoodCard";
import type { DetectedFood, MealType } from "@/lib/types/mealscan";

export default function CreateMealPage() {
  const router = useRouter();
  const [mealType, setMealType] = useState<string>("");
  const [foods, setFoods] = useState<DetectedFood[]>([]);
  const [mealDate, setMealDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isSaving, setIsSaving] = useState(false);

  // Récupérer l'aliment sélectionné depuis sessionStorage au montage
  useState(() => {
    if (typeof window !== 'undefined') {
      const selectedFoodItem = sessionStorage.getItem('selectedFoodItem');
      if (selectedFoodItem) {
        try {
          const foodItem = JSON.parse(selectedFoodItem);
          console.log("🍴 [CREATE MEAL] Aliment récupéré:", foodItem);
          
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
  });

  // Recalculer le résumé nutritionnel
  const calculateNutritionSummary = () => {
    if (foods.length === 0) {
      return {
        energy_kcal: 0,
        proteins: 0,
        carbohydrates: 0,
        fat: 0,
      };
    }

    return foods.reduce(
      (acc, food) => ({
        energy_kcal: acc.energy_kcal + food.nutrition.energy_kcal,
        proteins: acc.proteins + food.nutrition.proteins,
        carbohydrates: acc.carbohydrates + food.nutrition.carbohydrates,
        fat: acc.fat + food.nutrition.fat,
      }),
      { energy_kcal: 0, proteins: 0, carbohydrates: 0, fat: 0 }
    );
  };

  const nutritionSummary = calculateNutritionSummary();
  const totalCalories = nutritionSummary.energy_kcal;

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedFoods = [...foods];
    const food = updatedFoods[index];
    const ratio = newQuantity / food.quantity_value;

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
    setFoods(foods.filter((_, i) => i !== index));
  };

  const handleAddFood = () => {
    router.push("/add-manual?returnTo=/create-meal");
  };

  const handleSaveMeal = async () => {
    if (!mealType) {
      alert("Veuillez sélectionner un type de repas");
      return;
    }

    if (foods.length === 0) {
      alert("Veuillez ajouter au moins un aliment");
      return;
    }

    if (!mealDate) {
      alert("Veuillez sélectionner une date");
      return;
    }

    setIsSaving(true);

    try {
      const { addManualMeal } = await import("@/lib/mealscan.service");

      const mealName = foods.length > 0 
        ? foods.map(f => f.name).slice(0, 3).join(", ") + (foods.length > 3 ? "..." : "")
        : "Repas personnalisé";

      await addManualMeal({
        meal_name: mealName,
        meal_type: mealType as MealType,
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

      alert("Repas créé avec succès !");
      router.push("/journal");
    } catch (error) {
      console.error("❌ Erreur lors de la création du repas:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la création du repas");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-8">
      <MealResultNavbar
        onBack={() => router.back()}
        onAddToJournal={handleSaveMeal}
        mealType={mealType}
        onMealTypeChange={setMealType}
        isAddingToJournal={isSaving}
        mode="scan"
        mealDate={mealDate}
        onDateChange={setMealDate}
        onAddManually={() => {}}
      />

      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Message si aucun aliment */}
        {foods.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
              <ForkKnife size={40} weight="duotone" className="text-[#F7941D]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Créez votre repas
            </h2>
            <p className="text-gray-600 mb-6">
              Ajoutez des aliments pour composer votre repas personnalisé
            </p>
            <button
              onClick={handleAddFood}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-semibold hover:opacity-90 transition-all"
            >
              Ajouter un aliment
            </button>
          </div>
        )}

        {/* Résumé nutritionnel */}
        {foods.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Fire size={24} weight="fill" className="text-[#F7941D]" />
              Résumé nutritionnel
            </h2>

            {/* Calories */}
            <div className="text-center mb-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
              <p className="text-5xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent">
                {Math.round(totalCalories)}
              </p>
              <p className="text-sm text-gray-600 mt-2 font-medium">Calories totales</p>
            </div>

            {/* Macronutriments */}
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
          </div>
        )}

        {/* Liste des aliments */}
        {foods.length > 0 && (
          <div className="bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Drop size={24} weight="fill" className="text-[#17a2b8]" />
                Aliments ({foods.length})
              </h2>
              <button
                onClick={handleAddFood}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F7941D] text-white font-semibold hover:opacity-90 transition-all"
              >
                <Plus size={20} weight="bold" />
                <span className="text-sm">Ajouter</span>
              </button>
            </div>

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
        )}
      </div>
    </div>
  );
}
