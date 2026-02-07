"use client";

import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import WeekCalendar from "@/components/dashboard/WeekCalendar";
import CalorieProgress from "@/components/dashboard/CalorieProgress";
import MacroCard from "@/components/dashboard/MacroCard";
import ScanButton from "@/components/dashboard/ScanButton";
import BottomNav from "@/components/dashboard/BottomNav";
import { Camera, Barcode } from "phosphor-react";

export default function DashboardPage() {
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
  // Données exemple - à remplacer par des vraies données
  const userData = {
    name: "Utilisateur",
    avatar: undefined,
    calories: {
      current: 1250,
      goal: 2000,
    },
    macros: {
      proteins: { current: 85, goal: 150 },
      carbs: { current: 120, goal: 250 },
      fats: { current: 45, goal: 70 },
    },
  };

  const handleScanMeal = () => {
    console.log("Scanner un repas");
    window.location.href = "/scan";
  };

  const handleScanProduct = () => {
    console.log("Scanner un produit");
    window.location.href = "/scan";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <main className="px-6 py-6 space-y-6">
        {/* Calendrier de la semaine */}
        <WeekCalendar />

        {/* Progression des calories */}
        <CalorieProgress
          current={userData.calories.current}
          goal={userData.calories.goal}
        />

        {/* Macros quotidiennes */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
            Macros quotidiennes
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <MacroCard
              name="Protéines"
              amount={userData.macros.proteins.current}
              unit="g"
              goal={userData.macros.proteins.goal}
              color="#662D91"
            />
            <MacroCard
              name="Glucides"
              amount={userData.macros.carbs.current}
              unit="g"
              goal={userData.macros.carbs.goal}
              color="#F7941D"
            />
            <MacroCard
              name="Lipides"
              amount={userData.macros.fats.current}
              unit="g"
              goal={userData.macros.fats.goal}
              color="#17a2b8"
            />
          </div>
        </div>

        {/* Boutons de scan */}
        <div className="grid grid-cols-2 gap-3">
          <ScanButton
            icon={<Camera size={24} weight="bold" className="text-white" />}
            title="Scanner un repas"
            subtitle="Reconnaissance IA instantanée"
            onClick={handleScanMeal}
          />

          <ScanButton
            icon={<Barcode size={24} weight="bold" className="text-white" />}
            title="Scanner un produit"
            subtitle="Lecture de codes-barres"
            onClick={handleScanProduct}
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
