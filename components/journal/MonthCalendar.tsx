"use client";

import { useState, useEffect, useRef } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import type { JournalDayStatus } from "@/lib/types/journal";

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasData: boolean;
  goalAchieved: boolean;
  dateStr: string;
}

export interface MonthCalendarProps {
  /** Date sélectionnée au format YYYY-MM-DD */
  selectedDate?: string;
  /** Appelé quand l'utilisateur choisit un jour */
  onSelectDate?: (date: string) => void;
  /** Statut par jour (API journal/month). Clé = YYYY-MM-DD, valeur = reached | not_reached | no_data */
  monthlyGoalStatus?: Record<string, JournalDayStatus>;
  /** Appelé quand le mois affiché change (year, month 1–12) pour charger les données du mois */
  onMonthChange?: (year: number, month: number) => void;
}

export default function MonthCalendar({
  selectedDate,
  onSelectDate,
  monthlyGoalStatus,
  onMonthChange,
}: MonthCalendarProps = {}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const onMonthChangeRef = useRef(onMonthChange);
  onMonthChangeRef.current = onMonthChange;

  useEffect(() => {
    onMonthChangeRef.current?.(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  const daysOfWeek = ["L", "M", "M", "J", "V", "S", "D"];
  
  const getDaysInMonth = (date: Date, statusByDate?: Record<string, JournalDayStatus>): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Jour de la semaine du premier jour (0 = dimanche, ajuster pour lundi = 0)
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: CalendarDay[] = [];
    
    const pad = (n: number) => n.toString().padStart(2, "0");
    const toDateStr = (y: number, mZeroBased: number, d: number) =>
      `${y}-${pad(mZeroBased + 1)}-${pad(d)}`;

    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonth = month === 0 ? 11 : month - 1;

    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      days.push({
        day: d,
        isCurrentMonth: false,
        isToday: false,
        hasData: false,
        goalAchieved: false,
        dateStr: toDateStr(prevMonthYear, prevMonth, d),
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const dateStr = toDateStr(year, month, day);
      const status = statusByDate?.[dateStr];
      const hasData = status !== undefined && status !== "no_data";
      const goalAchieved = status === "reached";

      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        hasData,
        goalAchieved,
        dateStr,
      });
    }

    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonth = month === 11 ? 0 : month + 1;

    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasData: false,
        goalAchieved: false,
        dateStr: toDateStr(nextMonthYear, nextMonth, day),
      });
    }
    
    return days;
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const days = getDaysInMonth(currentDate, monthlyGoalStatus);
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <CaretLeft size={20} weight="bold" className="text-gray-600" />
        </button>
        
        <h3 className="text-lg font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <CaretRight size={20} weight="bold" className="text-gray-600" />
        </button>
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected =
            selectedDate && day.isCurrentMonth && day.dateStr === selectedDate;
          return (
            <button
              key={index}
              type="button"
              onClick={() => day.isCurrentMonth && onSelectDate?.(day.dateStr)}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
                ${!day.isCurrentMonth && "text-gray-300 cursor-default"}
                ${day.isCurrentMonth && "cursor-pointer"}
                ${day.isCurrentMonth && !day.isToday && !isSelected && "text-gray-700 hover:bg-gray-100"}
                ${day.isToday && !isSelected && "bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold"}
                ${isSelected && "ring-2 ring-[#17a2b8] ring-offset-2 bg-teal-50 text-gray-900 font-bold"}
                ${day.hasData && day.goalAchieved && !day.isToday && !isSelected && "bg-green-100 text-green-700"}
                ${day.hasData && !day.goalAchieved && !day.isToday && !isSelected && "bg-red-100 text-red-700"}
              `}
            >
              {day.day}
              {day.hasData && !day.isToday && (
                <div
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${
                    day.goalAchieved ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Objectif atteint</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Non atteint</span>
        </div>
      </div>
    </div>
  );
}
