"use client";

interface CalorieProgressProps {
  current: number;
  goal: number;
}

export default function CalorieProgress({ current, goal }: CalorieProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
      <div className="relative w-48 h-48 mb-4 -m-4">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ED1C24" />
              <stop offset="50%" stopColor="#F7941D" />
              <stop offset="100%" stopColor="#ED1C24" />
            </linearGradient>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2"/>
              <feComponentTransfer in="blur1" result="blur1-dimmed">
                <feFuncA type="linear" slope="0.4"/>
              </feComponentTransfer>
              <feComponentTransfer in="blur2" result="blur2-dimmed">
                <feFuncA type="linear" slope="0.2"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="blur2-dimmed"/>
                <feMergeNode in="blur1-dimmed"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="#E5E7EB"
            strokeWidth="16"
            fill="none"
          />
          {/* Progress circle with neon effect on the bar only */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#gradient)"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-500"
            filter="url(#neon-glow)"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{current}</span>
          <span className="text-sm text-gray-500">/ {goal} kcal</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent mb-1">
          {percentage.toFixed(0)}% de votre objectif
        </p>
        <p className="text-sm text-gray-500">
          {remaining} kcal restantes pour aujourd'hui
        </p>
      </div>
    </div>
  );
}
