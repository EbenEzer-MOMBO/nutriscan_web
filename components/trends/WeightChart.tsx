"use client";

export default function WeightChart() {
  // Fausses données pour le graphique de poids sur 7 jours
  const data = [
    { day: "Lun", weight: 72.5 },
    { day: "Mar", weight: 72.3 },
    { day: "Mer", weight: 72.1 },
    { day: "Jeu", weight: 71.8 },
    { day: "Ven", weight: 71.9 },
    { day: "Sam", weight: 71.7 },
    { day: "Dim", weight: 71.5 },
  ];

  const maxWeight = Math.max(...data.map(d => d.weight));
  const minWeight = Math.min(...data.map(d => d.weight));
  const range = maxWeight - minWeight;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Évolution du Poids</h3>
        <span className="text-sm text-gray-500">7 derniers jours</span>
      </div>

      <div className="relative h-48">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-gray-100"></div>
          ))}
        </div>

        {/* Chart */}
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {data.map((point, index) => {
            const height = ((point.weight - minWeight) / range) * 100;
            const isFirst = index === 0;
            const isLast = index === data.length - 1;

            return (
              <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                {/* Bar */}
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-semibold text-gray-700 mb-1">
                    {point.weight}
                  </span>
                  <div
                    className="w-8 rounded-t-lg bg-gradient-to-t from-[#ED1C24] to-[#F7941D] transition-all duration-500"
                    style={{
                      height: `${Math.max(height, 20)}%`,
                      boxShadow: '0 0 8px rgba(237, 28, 36, 0.3)',
                    }}
                  ></div>
                </div>
                
                {/* Day label */}
                <span className={`text-xs font-medium mt-1 ${isFirst || isLast ? 'text-gray-900' : 'text-gray-500'}`}>
                  {point.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <div>
          <p className="text-gray-500">Début</p>
          <p className="font-bold text-gray-900">{data[0].weight} kg</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Changement</p>
          <p className="font-bold text-green-600">-{(data[0].weight - data[data.length - 1].weight).toFixed(1)} kg</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Actuel</p>
          <p className="font-bold text-gray-900">{data[data.length - 1].weight} kg</p>
        </div>
      </div>
    </div>
  );
}
