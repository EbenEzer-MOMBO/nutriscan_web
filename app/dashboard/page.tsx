"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import WeekCalendar from "@/components/dashboard/WeekCalendar";
import CalorieProgress from "@/components/dashboard/CalorieProgress";
import MacroCard from "@/components/dashboard/MacroCard";
import ScanButton from "@/components/dashboard/ScanButton";
import BottomNav from "@/components/dashboard/BottomNav";
import { Camera, Barcode } from "phosphor-react";
import { UserProfile } from "@/lib/types/profile";
import { getProfile } from "@/lib/profile.service";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProfile();

      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        // Pas de profil trouvé, rediriger vers l'onboarding
        console.log("Pas de profil trouvé, redirection vers onboarding");
        router.push("/onboarding-profile");
      }
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
      setError("Erreur lors du chargement du profil");
    } finally {
      setIsLoading(false);
    }
  };

  // Données exemple pour la consommation actuelle (à remplacer par les vraies données des repas)
  const currentConsumption = {
    calories: 1250,
    proteins: 85,
    carbs: 120,
    fats: 45,
  };

  const handleScanMeal = () => {
    console.log("Scanner un repas");
    window.location.href = "/scan";
  };

  const handleScanProduct = () => {
    console.log("Scanner un produit");
    window.location.href = "/scan";
  };

  // Skeleton loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header />
        <main className="px-6 py-6 space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-20 bg-gray-200 rounded-2xl"></div>
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Erreur ou pas de profil
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || "Profil non trouvé"}</p>
          <button
            onClick={() => router.push("/onboarding-profile")}
            className="px-6 py-3 bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white rounded-xl font-semibold"
          >
            Créer mon profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <main className="px-6 py-6 space-y-6">
        {/* Calendrier de la semaine */}
        <WeekCalendar />

        {/* Progression des calories */}
        <CalorieProgress
          current={currentConsumption.calories}
          goal={profile.daily_targets.calories}
        />

        {/* Macros quotidiennes */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
            Macros quotidiennes
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <MacroCard
              name="Protéines"
              amount={currentConsumption.proteins}
              unit="g"
              goal={profile.daily_targets.proteins}
              color="#662D91"
            />
            <MacroCard
              name="Glucides"
              amount={currentConsumption.carbs}
              unit="g"
              goal={profile.daily_targets.carbs}
              color="#F7941D"
            />
            <MacroCard
              name="Lipides"
              amount={currentConsumption.fats}
              unit="g"
              goal={profile.daily_targets.fat}
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
