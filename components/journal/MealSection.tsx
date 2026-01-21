"use client";

import { Plus } from "phosphor-react";

interface MealItem {
  id: string;
  name: string;
  time: string;
  calories: number;
  icon: string;
}

interface MealSectionProps {
  title: string;
  meals: MealItem[];
  onAdd: () => void;
}

export default function MealSection({ title, meals, onAdd }: MealSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button
          onClick={onAdd}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17a2b8] text-white hover:bg-[#138496] transition-all active:scale-90"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>
      <div className="space-y-2">
        {meals.map((item) => (
          <MealCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function MealCard({ item }: { item: MealItem }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all active:scale-98">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-2xl flex-shrink-0">
        {item.icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
        <p className="text-sm text-gray-500">{item.time}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">{item.calories} kcal</p>
      </div>
    </div>
  );
}
