"use client";

interface MacrosGridProps {
  proteins: number;
  carbs: number;
  fats: number;
}

export default function MacrosGrid({ proteins, carbs, fats }: MacrosGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
        <p className="text-xs text-gray-500 mb-1">Protéines</p>
        <p className="text-2xl font-bold text-[#662D91]">{proteins}g</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
        <p className="text-xs text-gray-500 mb-1">Glucides</p>
        <p className="text-2xl font-bold text-[#F7941D]">{carbs}g</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
        <p className="text-xs text-gray-500 mb-1">Lipides</p>
        <p className="text-2xl font-bold text-[#17a2b8]">{fats}g</p>
      </div>
    </div>
  );
}
