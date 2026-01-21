"use client";

import { useEffect, useState } from "react";
import { Lightning } from "phosphor-react";

interface CaloriesCardProps {
  consumed: number;
  goal: number;
}

export default function CaloriesCard({ consumed, goal }: CaloriesCardProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);

  useEffect(() => {
    // Animation de remplissage initial
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">Objectif Quotidien</h3>
        <button className="text-[#17a2b8] hover:text-[#138496] transition-colors">
          <Lightning size={20} weight="fill" />
        </button>
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent">
          {consumed}
        </span>
        <span className="text-xl text-gray-400">/ {goal} kcal</span>
      </div>

      {/* Progress bar with animation */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] transition-all duration-1000 ease-out"
          style={{
            width: `${animatedWidth}%`,
            boxShadow: '0 0 8px rgba(237, 28, 36, 0.4), 0 0 12px rgba(247, 148, 29, 0.3)',
          }}
        ></div>
      </div>

      <p className="text-sm text-gray-500">{remaining} kcal restantes</p>
    </div>
  );
}
