"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";
import CaloriesCard from "@/components/journal/CaloriesCard";
import MacrosGrid from "@/components/journal/MacrosGrid";
import MealSection from "@/components/journal/MealSection";
import MonthCalendar from "@/components/journal/MonthCalendar";
import { useJournal, useJournalMonth, useDeleteMeal } from "@/lib/hooks/use-queries";
import type {
  JournalConsumed,
  JournalGoals,
} from "@/lib/types/journal";
import type { ScannedMeal } from "@/lib/types/mealscan";

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
  snack: "Snacks",
};

const MEAL_TYPE_ICONS: Record<string, string> = {
  breakfast: "🍳",
  lunch: "🍽️",
  dinner: "🌙",
  snack: "🍎",
};

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function formatMealTime(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const day = DAY_NAMES[d.getDay()];
    const h = d.getHours();
    const m = d.getMinutes();
    const time = `${h}h${m > 0 ? m.toString().padStart(2, "0") : ""}`;
    return `${day} • ${time}`;
  } catch {
    return "";
  }
}

function mealToDisplayName(meal: ScannedMeal): string {
  if (meal.foods_detected?.length) {
    const names = meal.foods_detected.map((f) => f.name);
    return names.length > 2 ? `${names[0]}, ${names[1]}…` : names.join(", ");
  }
  return "Repas scanné";
}

function groupMealsByType(meals: ScannedMeal[]): Record<string, { id: string; name: string; time: string; calories: number; icon: string }[]> {
  const groups: Record<string, { id: string; name: string; time: string; calories: number; icon: string }[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
  for (const meal of meals) {
    const type = meal.meal_type ?? "snack";
    const key = type === "snack" ? "snacks" : type;
    if (!groups[key]) groups[key] = [];
    groups[key].push({
      id: String(meal.id),
      name: mealToDisplayName(meal),
      time: formatMealTime(meal.scanned_at),
      calories: Math.round(meal.total_calories),
      icon: MEAL_TYPE_ICONS[type] ?? "🍽️",
    });
  }
  return groups;
}

function todayStr(): string {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, "0") + "-" + d.getDate().toString().padStart(2, "0");
}

export default function JournalPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(() => todayStr());
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  const { data: journal, isLoading, isError, error } = useJournal(selectedDate);
  const { data: monthData } = useJournalMonth(
    calendarMonth.year,
    calendarMonth.month
  );
  const deleteMealMutation = useDeleteMeal();

  const handleMonthChange = useCallback((year: number, month: number) => {
    setCalendarMonth({ year, month });
  }, []);

  useEffect(() => {
    const preventSwipeBack = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      if (touch.clientX < 20) e.preventDefault();
    };
    document.addEventListener("touchstart", preventSwipeBack, { passive: false });
    return () => document.removeEventListener("touchstart", preventSwipeBack);
  }, []);

  const consumed: JournalConsumed = journal?.consumed ?? {
    total_calories: 0,
    total_proteins: 0,
    total_carbohydrates: 0,
    total_fat: 0,
    total_meals: 0,
  };
  const goals: JournalGoals | null = journal?.goals ?? null;
  const grouped = journal?.meals ? groupMealsByType(journal.meals) : null;
  const monthlyGoalStatus = monthData?.monthly_goal_status ?? {};

  const handleAddMeal = (mealType: string) => {
    router.push("/add");
  };

  const handleDeleteMeal = useCallback(
    (mealId: string) => {
      if (!confirm("Supprimer ce repas du journal ?")) return;
      deleteMealMutation.mutate(parseInt(mealId, 10), {
        onError: (err) => {
          alert(err instanceof Error ? err.message : "Erreur lors de la suppression.");
        },
      });
    },
    [deleteMealMutation]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <main className="px-6 py-6 space-y-6">
        <MonthCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          monthlyGoalStatus={monthlyGoalStatus}
          onMonthChange={handleMonthChange}
        />

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
            {error instanceof Error ? error.message : "Erreur lors du chargement du journal."}
          </div>
        )}

        {isLoading && !journal && (
          <div className="text-center py-8 text-gray-500">
            Chargement du journal…
          </div>
        )}

        {journal && (
          <>
            <CaloriesCard
              consumed={Math.round(consumed.total_calories)}
              goal={goals?.calories ?? 0}
            />

            <MacrosGrid
              proteins={Math.round(consumed.total_proteins)}
              carbs={Math.round(consumed.total_carbohydrates)}
              fats={Math.round(consumed.total_fat)}
            />

            <MealSection
              title={MEAL_TYPE_LABELS.breakfast}
              meals={grouped?.breakfast ?? []}
              onAdd={() => handleAddMeal("breakfast")}
              onDelete={handleDeleteMeal}
              iconType="breakfast"
            />
            <MealSection
              title={MEAL_TYPE_LABELS.lunch}
              meals={grouped?.lunch ?? []}
              onAdd={() => handleAddMeal("lunch")}
              onDelete={handleDeleteMeal}
              iconType="lunch"
            />
            <MealSection
              title={MEAL_TYPE_LABELS.dinner}
              meals={grouped?.dinner ?? []}
              onAdd={() => handleAddMeal("dinner")}
              onDelete={handleDeleteMeal}
              iconType="dinner"
            />
            <MealSection
              title={MEAL_TYPE_LABELS.snack}
              meals={grouped?.snacks ?? []}
              onAdd={() => handleAddMeal("snacks")}
              onDelete={handleDeleteMeal}
              iconType="snack"
            />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
