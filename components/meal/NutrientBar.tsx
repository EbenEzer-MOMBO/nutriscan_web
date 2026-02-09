"use client";

interface NutrientBarProps {
    label: string;
    value: number;
    unit: string;
    color: "protein" | "carbs" | "fat";
    maxValue: number;
    beforeValue?: number; // Valeur avant ajout au journal (pour la barre plus claire)
}

const COLOR_SCHEMES = {
    protein: {
        light: "bg-blue-200",
        dark: "bg-blue-500",
        text: "text-blue-700",
    },
    carbs: {
        light: "bg-amber-200",
        dark: "bg-amber-500",
        text: "text-amber-700",
    },
    fat: {
        light: "bg-rose-200",
        dark: "bg-rose-500",
        text: "text-rose-700",
    },
};

export default function NutrientBar({
    label,
    value,
    unit,
    color,
    maxValue,
    beforeValue,
}: NutrientBarProps) {
    const scheme = COLOR_SCHEMES[color];
    const percentage = Math.min((value / maxValue) * 100, 100);
    const beforePercentage = beforeValue
        ? Math.min((beforeValue / maxValue) * 100, 100)
        : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className={`text-sm font-bold ${scheme.text}`}>
                    {value}
                    {unit}
                </span>
            </div>

            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                {/* Barre avant ajout (plus claire) */}
                {beforeValue && beforeValue > 0 && (
                    <div
                        className={`absolute top-0 left-0 h-full ${scheme.light} transition-all duration-500`}
                        style={{ width: `${beforePercentage}%` }}
                    />
                )}

                {/* Barre après ajout (plus foncée) */}
                <div
                    className={`absolute top-0 left-0 h-full ${scheme.dark} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>0{unit}</span>
                <span>
                    {maxValue}
                    {unit}
                </span>
            </div>
        </div>
    );
}
