"use client";

export default function CaloriesChart() {
  // Fausses données pour les calories sur 7 jours
  const data = [
    { day: "L", consumed: 1850, goal: 2000 },
    { day: "M", consumed: 2100, goal: 2000 },
    { day: "M", consumed: 1920, goal: 2000 },
    { day: "J", consumed: 2050, goal: 2000 },
    { day: "V", consumed: 1780, goal: 2000 },
    { day: "S", consumed: 2200, goal: 2000 },
    { day: "D", consumed: 1950, goal: 2000 },
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.consumed, d.goal)));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Calories Hebdomadaires</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D]"></div>
            <span className="text-gray-600">Consommées</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">Objectif</span>
          </div>
        </div>
      </div>

      <div className="relative h-48">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-gray-100"></div>
          ))}
        </div>

        {/* Chart */}
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {data.map((point, index) => {
            const consumedHeight = (point.consumed / maxValue) * 100;
            const goalHeight = (point.goal / maxValue) * 100;
            const isOverGoal = point.consumed > point.goal;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                {/* Bars container */}
                <div className="w-full flex justify-center items-end gap-1 mb-2">
                  {/* Goal bar */}
                  <div
                    className="w-5 rounded-t-lg bg-gray-200 transition-all duration-500"
                    style={{
                      height: `${Math.max(goalHeight, 10)}%`,
                    }}
                  ></div>
                  
                  {/* Consumed bar */}
                  <div
                    className={`w-5 rounded-t-lg transition-all duration-500 ${
                      isOverGoal 
                        ? 'bg-gradient-to-t from-[#F7941D] to-[#ED1C24]' 
                        : 'bg-gradient-to-t from-[#ED1C24] to-[#F7941D]'
                    }`}
                    style={{
                      height: `${Math.max(consumedHeight, 10)}%`,
                      boxShadow: '0 0 6px rgba(237, 28, 36, 0.3)',
                    }}
                  ></div>
                </div>
                
                {/* Day label */}
                <span className="text-xs font-medium text-gray-600 mt-1">
                  {point.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <p className="text-gray-500 mb-1">Moyenne</p>
          <p className="font-bold text-gray-900">
            {Math.round(data.reduce((acc, d) => acc + d.consumed, 0) / data.length)} kcal
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Jours réussis</p>
          <p className="font-bold text-green-600">
            {data.filter(d => d.consumed <= d.goal).length}/7
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Écart moyen</p>
          <p className="font-bold text-[#F7941D]">
            {Math.abs(Math.round(data.reduce((acc, d) => acc + (d.consumed - d.goal), 0) / data.length))} kcal
          </p>
        </div>
      </div>
    </div>
  );
}
