"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasData: boolean;
  goalAchieved: boolean;
}

export default function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  const daysOfWeek = ["L", "M", "M", "J", "V", "S", "D"];
  
  const getDaysInMonth = (date: Date): CalendarDay[] => {
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
    
    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        hasData: false,
        goalAchieved: false,
      });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      
      // Simuler des données pour les jours passés
      const hasData = day <= today.getDate() && month <= today.getMonth();
      const goalAchieved = hasData && Math.random() > 0.3; // 70% de réussite
      
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        hasData,
        goalAchieved,
      });
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasData: false,
        goalAchieved: false,
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
  
  const days = getDaysInMonth(currentDate);
  
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
        {days.map((day, index) => (
          <button
            key={index}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
              ${!day.isCurrentMonth && "text-gray-300"}
              ${day.isCurrentMonth && !day.isToday && "text-gray-700 hover:bg-gray-100"}
              ${day.isToday && "bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold"}
              ${day.hasData && day.goalAchieved && !day.isToday && "bg-green-100 text-green-700"}
              ${day.hasData && !day.goalAchieved && !day.isToday && "bg-red-100 text-red-700"}
            `}
          >
            {day.day}
            {day.hasData && !day.isToday && (
              <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                day.goalAchieved ? "bg-green-500" : "bg-red-500"
              }`}></div>
            )}
          </button>
        ))}
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
