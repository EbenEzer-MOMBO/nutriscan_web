"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export default function StatCard({ title, value, unit, icon, change, changeType = "neutral" }: StatCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
        <div className="text-[#F7941D]">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent">
          {value}
        </span>
        <span className="text-lg text-gray-400">{unit}</span>
      </div>
      
      {change && (
        <p className={`text-sm ${changeColors[changeType]}`}>
          {change}
        </p>
      )}
    </div>
  );
}
