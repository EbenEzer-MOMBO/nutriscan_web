"use client";

import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";
import CaloriesCard from "@/components/journal/CaloriesCard";
import MacrosGrid from "@/components/journal/MacrosGrid";
import MealSection from "@/components/journal/MealSection";
import MonthCalendar from "@/components/journal/MonthCalendar";
import { Plus } from "phosphor-react";

export default function JournalPage() {
  useEffect(() => {
    // Empêcher le geste de retour natif sur mobile
    const preventSwipeBack = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      
      const touch = e.touches[0];
      const isLeftEdge = touch.clientX < 20;
      
      if (isLeftEdge) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventSwipeBack, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipeBack);
    };
  }, []);
  // Données exemple
  const caloriesGoal = 2000;
  const caloriesConsumed = 1250;

  const meals = {
    breakfast: [
      { id: "1", name: "Avocado Toast", time: "Lundi • 8h", calories: 350, icon: "🥑" },
    ],
    lunch: [
      { id: "2", name: "Poulet Grillé & Riz", time: "Lundi • 12h30", calories: 520, icon: "🍗" },
    ],
    dinner: [
      { id: "3", name: "Salade Mixte", time: "Lundi • 19h", calories: 120, icon: "🥗" },
    ],
    snacks: [
      { id: "4", name: "Pomme Granny Smith", time: "Lundi • 16h", calories: 95, icon: "🍎" },
    ],
  };

  const handleAddMeal = (mealType: string) => {
    console.log("Ajouter un repas:", mealType);
    // TODO: Ouvrir un modal ou naviguer vers la page d'ajout
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <main className="px-6 py-6 space-y-6">
        {/* Calendrier mensuel */}
        <MonthCalendar />

        {/* Calories */}
        <CaloriesCard consumed={caloriesConsumed} goal={caloriesGoal} />

        {/* Macros */}
        <MacrosGrid proteins={150} carbs={150} fats={45} />

        {/* Repas */}
        <MealSection
          title="Petit-déjeuner"
          meals={meals.breakfast}
          onAdd={() => handleAddMeal("breakfast")}
        />

        <MealSection
          title="Déjeuner"
          meals={meals.lunch}
          onAdd={() => handleAddMeal("lunch")}
        />

        <MealSection
          title="Dîner"
          meals={meals.dinner}
          onAdd={() => handleAddMeal("dinner")}
        />

        <MealSection
          title="Snacks"
          meals={meals.snacks}
          onAdd={() => handleAddMeal("snacks")}
        />

        {/* Ajouter un repas pour ce soir */}
        <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#17a2b8] hover:text-[#17a2b8] transition-all active:scale-98 flex items-center justify-center gap-2">
          <Plus size={20} weight="bold" />
          <span className="font-medium">Ajouter un repas pour ce soir</span>
        </button>
      </main>
      
      <BottomNav />
    </div>
  );
}
