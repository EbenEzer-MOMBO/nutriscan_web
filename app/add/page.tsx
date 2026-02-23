"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";
import { MagnifyingGlass, Clock, Camera, Barcode } from "phosphor-react";
import { useMealHistory } from "@/lib/hooks/use-queries";
import Image from "next/image";

const MEAL_TYPE_ICONS: Record<string, string> = {
  breakfast: "🍳",
  lunch: "🍽️",
  dinner: "🌙",
  snack: "🍎",
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
  snack: "Collation",
};

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function AddPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: historyData, isLoading } = useMealHistory(1, 10);

  useEffect(() => {
    const preventSwipeBack = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      if (touch.clientX < 20) e.preventDefault();
    };
    document.addEventListener("touchstart", preventSwipeBack, { passive: false });
    return () => document.removeEventListener("touchstart", preventSwipeBack);
  }, []);

  const recentMeals = historyData?.data ?? [];
  const filteredMeals = searchQuery
    ? recentMeals.filter((meal) =>
        MEAL_TYPE_LABELS[meal.meal_type ?? "snack"]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : recentMeals;

  const handleMealClick = (mealId: number) => {
    router.push(`/meal/${mealId}`);
  };

  const handleNewScan = () => {
    router.push("/scan");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <main className="px-6 py-6 space-y-6">
        {/* Titre */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ajouter un repas
          </h1>
          <p className="text-gray-600 text-sm">
            Recherchez ou scannez un nouveau repas
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            weight="bold"
          />
          <input
            type="text"
            placeholder="Rechercher un repas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#17a2b8] focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Boutons d'action rapide */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNewScan}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-[#ED1C24] to-[#F7941D] text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Camera size={28} weight="bold" />
            </div>
            <span className="font-semibold text-sm text-center">
              Scanner repas
            </span>
          </button>

          <button
            onClick={handleNewScan}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 hover:border-[#17a2b8] hover:text-[#17a2b8] transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Barcode size={28} weight="bold" />
            </div>
            <span className="font-semibold text-sm text-center">
              Scanner produit
            </span>
          </button>
        </div>

        {/* Historique récent */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} weight="bold" className="text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Récents scans</h2>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 shadow-sm animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredMeals.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Clock size={32} className="text-gray-400" weight="regular" />
              </div>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? "Aucun résultat trouvé"
                  : "Aucun scan récent"}
              </p>
            </div>
          )}

          {!isLoading && filteredMeals.length > 0 && (
            <div className="space-y-3">
              {filteredMeals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => handleMealClick(meal.id)}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center gap-4"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    {meal.image_url ? (
                      <Image
                        src={meal.image_url}
                        alt="Repas"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {MEAL_TYPE_ICONS[meal.meal_type ?? "snack"] ?? "🍽️"}
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {meal.meal_type && (
                        <span className="px-2 py-0.5 rounded-full bg-[#17a2b8]/10 text-[#17a2b8] text-xs font-medium">
                          {MEAL_TYPE_LABELS[meal.meal_type]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 font-semibold mb-0.5">
                      {meal.foods_count}{" "}
                      {meal.foods_count > 1 ? "aliments" : "aliment"} •{" "}
                      {Math.round(meal.total_calories)} kcal
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(meal.scanned_at)}
                    </p>
                  </div>

                  {/* Flèche */}
                  <div className="flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-gray-400"
                    >
                      <path d="M7.5 15l5-5-5-5" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
