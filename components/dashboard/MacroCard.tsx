"use client";

interface MacroCardProps {
  name: string;
  amount: number;
  unit: string;
  goal: number;
  color: string;
}

export default function MacroCard({ name, amount, unit, goal, color }: MacroCardProps) {
  const percentage = (amount / goal) * 100;

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
          className="h-full rounded-full transition-all duration-500 relative"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}, 0 0 12px ${color}80`,
          }}
        ></div>
      </div>
    </div>
  );
}
