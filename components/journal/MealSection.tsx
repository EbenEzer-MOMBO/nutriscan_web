"use client";

import { Plus, Coffee, ForkKnife, Moon, Cookie, Trash } from "phosphor-react";

export type MealSectionIconType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealItem {
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
  onDelete?: (id: string) => void;
  iconType?: MealSectionIconType;
}

const SECTION_ICONS = {
  breakfast: Coffee,
  lunch: ForkKnife,
  dinner: Moon,
  snack: Cookie,
};

export default function MealSection({
  title,
  meals,
  onAdd,
  onDelete,
  iconType = "snack",
}: MealSectionProps) {
  const IconComponent = SECTION_ICONS[iconType];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {meals.map((item) => (
          <MealCard
            key={item.id}
            item={item}
            onDelete={onDelete}
            IconComponent={IconComponent}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="w-full mt-2 py-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#F7941D] hover:text-[#F7941D] transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-white"
      >
        <Plus size={20} weight="bold" />
        <span className="font-medium">Ajouter un repas</span>
      </button>
    </div>
  );
}

function MealCard({
  item,
  onDelete,
  IconComponent,
}: {
  item: MealItem;
  onDelete?: (id: string) => void;
  IconComponent: React.ComponentType<{ size?: number; weight?: "fill" | "regular" | "duotone" | "bold"; className?: string }>;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]">
      <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#F7941D] flex items-center justify-center flex-shrink-0">
        <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}>
          <IconComponent size={24} weight="fill" className="text-white" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h4>
        <p className="text-sm text-gray-500">{item.time}</p>
      </div>
      <div className="text-right flex items-center gap-2 flex-shrink-0">
        <p className="font-bold text-gray-900">{item.calories} kcal</p>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Supprimer"
          >
            <Trash size={20} weight="regular" />
          </button>
        )}
      </div>
    </div>
  );
}

