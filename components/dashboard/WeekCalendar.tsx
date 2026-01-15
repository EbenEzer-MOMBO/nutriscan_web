"use client";

import { useState } from "react";

export default function WeekCalendar() {
  const [currentDate] = useState(new Date());
  
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const currentDay = currentDate.getDay();
  const monthYear = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  
  // Ajuster pour que lundi soit le premier jour (0 = lundi)
  const adjustedCurrentDay = currentDay === 0 ? 6 : currentDay - 1;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#17a2b8] uppercase">
          Semaine en cours
        </h3>
        <span className="text-sm text-[#17a2b8] capitalize">{monthYear}</span>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className={`text-xs font-medium mb-2 ${
              index === adjustedCurrentDay ? "text-[#ED1C24]" : "text-gray-500"
            }`}>
              {day}
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === adjustedCurrentDay
                ? "bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white"
                : "bg-gray-100 text-gray-400"
            }`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
