"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MagnifyingGlass, ForkKnife } from "phosphor-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllFoodItems } from "@/lib/fooditems.service";

export default function AddManualPage() {
  const router = useRouter();
  const searchParams = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Récupérer l'URL de retour depuis les query params
  const returnTo = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('returnTo')
    : null;

  // Debounce pour la recherche (500ms)
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      console.log("🔎 [SEARCH] Recherche avec:", searchInput);
      setSearchQuery(searchInput);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchInput]);

  // Utiliser useInfiniteQuery pour le scroll infini avec mise en cache optimisée
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["all-food-items", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("🔍 [FOOD ITEMS] Appel API - page:", pageParam, "search:", searchQuery);
      const result = await getAllFoodItems(pageParam, 50, searchQuery || undefined);
      console.log("✅ [FOOD ITEMS] Résultats reçus:", result.data?.length, "aliments");
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.success || !lastPage.data) return undefined;
      const currentPage = lastPage.meta.current_page;
      const totalPages = lastPage.meta.last_page;
      console.log("📄 [FOOD ITEMS] Pagination:", currentPage, "/", totalPages);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // Les données restent fraîches pendant 5 minutes
    gcTime: 10 * 60 * 1000, // Les données sont gardées en cache pendant 10 minutes
    refetchOnWindowFocus: false, // Ne pas refetch quand on revient sur la fenêtre
    refetchOnMount: false, // Ne pas refetch si les données sont en cache
  });

  // Log quand on utilise le cache
  useEffect(() => {
    if (!isLoading && !isFetching && data) {
      console.log("💾 [CACHE] Résultats chargés depuis le cache");
    }
  }, [isLoading, isFetching, data]);

  // Log des erreurs
  useEffect(() => {
    if (isError) {
      console.error("❌ [FOOD ITEMS] Erreur de chargement:", error);
    }
  }, [isError, error]);

  // Observer pour le scroll infini
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Combiner toutes les pages
  const allFoodItems = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const handleFoodItemClick = (foodItem: any) => {
    console.log("🍴 Aliment sélectionné:", foodItem);
    
    // Stocker l'aliment sélectionné dans sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedFoodItem', JSON.stringify(foodItem));
    }
    
    // Retourner à la page précédente ou créer un nouveau repas
    if (returnTo) {
      router.push(returnTo);
    } else {
      router.back();
    }
  };

  const handleCreateCustomMeal = () => {
    router.push("/create-meal");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={24} weight="bold" className="text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Ajouter un aliment
            </h1>
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
              placeholder="Rechercher un aliment..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F7941D] focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
            />
            {searchInput !== searchQuery && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[#F7941D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Bouton Personnaliser */}
          <button
            onClick={handleCreateCustomMeal}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ForkKnife size={24} weight="bold" />
            <span>Personnaliser mon repas</span>
          </button>
        </div>
      </div>

      {/* Liste des aliments */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Erreur */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <p className="text-red-700 text-sm font-medium">
              Erreur de chargement : {error instanceof Error ? error.message : "Erreur inconnue"}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && allFoodItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ForkKnife size={32} className="text-gray-400" weight="regular" />
            </div>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "Aucun aliment trouvé"
                : "Aucun aliment disponible"}
            </p>
          </div>
        )}

        {!isLoading && allFoodItems.length > 0 && (
          <>
            <div className="space-y-3">
              {allFoodItems.map((foodItem, index) => (
                <button
                  key={`${foodItem.name}-${index}`}
                  onClick={() => handleFoodItemClick(foodItem)}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center gap-4"
                >
                  {/* Icône */}
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border-2 border-[#F7941D] flex items-center justify-center flex-shrink-0">
                    <ForkKnife size={24} weight="duotone" className="text-[#F7941D]" />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm text-gray-900 font-semibold mb-1 truncate">
                      {foodItem.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100">
                        {foodItem.reference_quantity} {foodItem.reference_unit}
                      </span>
                      <span>•</span>
                      <span>
                        {Math.round(foodItem.nutrition_per_reference.energy_kcal)} kcal
                      </span>
                    </div>
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

            {/* Élément observer pour le scroll infini */}
            <div ref={observerTarget} className="py-4">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7941D]"></div>
                </div>
              )}
              {!hasNextPage && allFoodItems.length > 20 && (
                <p className="text-center text-sm text-gray-500">
                  Vous avez vu tous les aliments
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
