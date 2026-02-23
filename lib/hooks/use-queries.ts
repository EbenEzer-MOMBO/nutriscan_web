"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/lib/profile.service";
import { getJournal, getJournalMonth } from "@/lib/journal.service";
import { getMealDetails, updateMeal, deleteMeal, getMealHistory } from "@/lib/mealscan.service";
import type { UpdateMealData } from "@/lib/types/mealscan";

export const queryKeys = {
  profile: ["profile"] as const,
  journal: (date: string) => ["journal", date] as const,
  journalMonth: (year: number, month: number) =>
    ["journal-month", year, month] as const,
  meal: (id: number) => ["meal", id] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile,
    retry: false,
  });
}

export function useJournal(date: string | undefined) {
  return useQuery({
    queryKey: queryKeys.journal(date ?? ""),
    queryFn: () => getJournal(date),
    enabled: !!date,
  });
}

export function useJournalMonth(
  year: number,
  month: number,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.journalMonth(year, month),
    queryFn: () => getJournalMonth(year, month),
    enabled,
  });
}

export function useMealDetails(id: number | null) {
  return useQuery({
    queryKey: queryKeys.meal(id ?? 0),
    queryFn: () => getMealDetails(id!),
    enabled: id != null && id > 0,
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMealData }) =>
      updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["journal-month"] });
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["journal-month"] });
      queryClient.invalidateQueries({ queryKey: ["meal-history"] });
    },
  });
}

export function useMealHistory(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ["meal-history", page, perPage],
    queryFn: () => getMealHistory(page, perPage),
  });
}
