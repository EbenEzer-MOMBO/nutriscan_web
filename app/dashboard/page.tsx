"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import WeekCalendar from "@/components/dashboard/WeekCalendar";
import CalorieProgress from "@/components/dashboard/CalorieProgress";
import MacroCard from "@/components/dashboard/MacroCard";
import ScanButton from "@/components/dashboard/ScanButton";
import BottomNav from "@/components/dashboard/BottomNav";
import { Camera, Barcode } from "phosphor-react";
import {
  useProfile,
  useJournal,
  useJournalMonth,
} from "@/lib/hooks/use-queries";

function todayStr(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    d.getDate().toString().padStart(2, "0")
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const today = todayStr();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: profileResult, isLoading: profileLoading } = useProfile();
  const profile = profileResult?.success ? profileResult.data : null;
  const hasProfile = !!profile;

  const { data: journalData } = useJournal(hasProfile ? today : undefined);
  const { data: monthData } = useJournalMonth(year, month, hasProfile);

  useEffect(() => {
    if (profileLoading || profileResult === undefined) return;
    if (!profileResult.success || !profileResult.data) {
      router.push("/onboarding-profile");
    }
  }, [profileLoading, profileResult, router]);

  useEffect(() => {
    const preventSwipeBack = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      if (touch.clientX < 20) e.preventDefault();
    };
    document.addEventListener("touchstart", preventSwipeBack, { passive: false });
    return () =>
      document.removeEventListener("touchstart", preventSwipeBack);
  }, []);

  const currentConsumption = journalData?.consumed
    ? {
        calories: Math.round(journalData.consumed.total_calories),
        proteins: Math.round(journalData.consumed.total_proteins),
        carbs: Math.round(journalData.consumed.total_carbohydrates),
        fats: Math.round(journalData.consumed.total_fat),
      }
    : { calories: 0, proteins: 0, carbs: 0, fats: 0 };

  const monthlyGoalStatus = monthData?.monthly_goal_status ?? {};

  const handleScanMeal = () => {
    window.location.href = "/scan";
  };

  const handleScanProduct = () => {
    window.location.href = "/scan";
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header />
        <main className="px-6 py-6 space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-20 bg-gray-200 rounded-2xl" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-32 bg-gray-200 rounded-2xl" />
              <div className="h-32 bg-gray-200 rounded-2xl" />
              <div className="h-32 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {profileResult?.message || "Profil non trouvé"}
          </p>
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
        <WeekCalendar monthlyGoalStatus={monthlyGoalStatus} />

        <CalorieProgress
          current={currentConsumption.calories}
          goal={profile.daily_targets.calories}
        />

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
