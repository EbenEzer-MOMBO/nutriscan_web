"use client";

import { useEffect, useState } from "react";

interface MacroCardProps {
  name: string;
  amount: number;
  unit: string;
  goal: number;
  color: string;
}

export default function MacroCard({ name, amount, unit, goal, color }: MacroCardProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const safeGoal = goal > 0 ? goal : 1;
  const percentage = (amount / safeGoal) * 100;

  useEffect(() => {
    // Animation de remplissage initial avec délai différent pour chaque carte
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);
    }, 150);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h4 className={`text-sm font-semibold mb-2`} style={{ color }}>
        {name}
      </h4>
      <div className="mb-3">
        <span className="text-2xl font-bold text-gray-900">{amount}g</span>
        <span className="text-sm text-gray-500"> / {goal}g</span>
      </div>
      
      {/* Progress bar with neon effect */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${Math.min(animatedWidth, 100)}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}, 0 0 12px ${color}80`,
          }}
        ></div>
      </div>
    </div>
  );
}
