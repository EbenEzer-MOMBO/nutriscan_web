"use client";

import type { JournalDayStatus } from "@/lib/types/journal";

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Retourne le lundi de la semaine de la date donnée */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export interface WeekCalendarProps {
  /** Statut par jour (API journal/month). Clé = YYYY-MM-DD */
  monthlyGoalStatus?: Record<string, JournalDayStatus>;
}

export default function WeekCalendar({ monthlyGoalStatus = {} }: WeekCalendarProps) {
  const currentDate = new Date();
  const monday = getMonday(currentDate);
  const monthYear = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(toDateStr(d));
  }

  const currentDayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#17a2b8] uppercase">
          Semaine en cours
        </h3>
        <span className="text-sm text-[#17a2b8] capitalize">{monthYear}</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const status = monthlyGoalStatus[weekDates[index]] ?? "no_data";
          const isToday = index === currentDayIndex;
          const isReached = status === "reached";
          const isNotReached = status === "not_reached";

          return (
            <div key={index} className="flex flex-col items-center">
              <span
                className={`text-xs font-medium mb-2 ${
                  isToday ? "text-[#ED1C24]" : "text-gray-500"
                }`}
              >
                {day}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isToday
                    ? "bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white"
                    : isReached
                      ? "bg-green-100"
                      : isNotReached
                        ? "bg-red-100"
                        : "bg-gray-100 text-gray-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isToday
                      ? "bg-white"
                      : isReached
                        ? "bg-green-500"
                        : isNotReached
                          ? "bg-red-500"
                          : "bg-gray-400"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
