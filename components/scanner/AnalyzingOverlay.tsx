"use client";

import { useEffect, useState } from "react";
import { Barcode, ForkKnife, Sparkle } from "phosphor-react";

interface AnalyzingOverlayProps {
    type: "barcode" | "meal";
    isVisible: boolean;
}

const BARCODE_TIPS = [
    "Saviez-vous que le Nutri-Score va de A (meilleur) à E (moins bon) ?",
    "Les codes-barres EAN-13 sont les plus courants en Europe.",
    "Vérifiez toujours la liste des ingrédients pour les allergènes.",
    "Les additifs alimentaires commencent par la lettre E.",
    "Un produit bio ne signifie pas forcément qu'il est sain.",
    "Les sucres cachés peuvent avoir plus de 50 noms différents !",
];

const MEAL_TIPS = [
    "Une assiette équilibrée : 1/2 légumes, 1/4 protéines, 1/4 féculents.",
    "Buvez au moins 1,5L d'eau par jour pour rester hydraté.",
    "Les protéines aident à la satiété et au maintien musculaire.",
    "Les fibres favorisent une bonne digestion.",
    "Variez les couleurs dans votre assiette pour plus de nutriments !",
    "Prenez le temps de mâcher : la digestion commence dans la bouche.",
    "Les légumes de saison sont plus nutritifs et savoureux.",
];

export default function AnalyzingOverlay({ type, isVisible }: AnalyzingOverlayProps) {
    const [currentTip, setCurrentTip] = useState(0);
    const tips = type === "barcode" ? BARCODE_TIPS : MEAL_TIPS;

    useEffect(() => {
        if (!isVisible) return;

        // Changer l'astuce toutes les 4 secondes
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isVisible, tips.length]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-6">
            {/* Animation principale */}
            <div className="relative mb-12">
                {/* Cercles animés en arrière-plan */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-[#17a2b8]/20 animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-[#F7941D]/20 animate-pulse"></div>
                </div>

                {/* Icône centrale */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center shadow-2xl shadow-[#F7941D]/30 animate-bounce">
                    {type === "barcode" ? (
                        <Barcode size={40} weight="bold" className="text-white" />
                    ) : (
                        <ForkKnife size={40} weight="bold" className="text-white" />
                    )}
                </div>

                {/* Particules scintillantes */}
                <div className="absolute -top-4 -right-4 animate-pulse">
                    <Sparkle size={24} weight="fill" className="text-[#F7941D]" />
                </div>
                <div className="absolute -bottom-4 -left-4 animate-pulse delay-300">
                    <Sparkle size={20} weight="fill" className="text-[#17a2b8]" />
                </div>
            </div>

            {/* Texte d'analyse */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {type === "barcode" ? "Analyse du produit..." : "Analyse du repas..."}
                </h2>
                <p className="text-gray-600 text-sm">
                    {type === "barcode"
                        ? "Récupération des informations nutritionnelles"
                        : "Intelligence artificielle en action"}
                </p>
            </div>

            {/* Barre de progression */}
            <div className="w-full max-w-md mb-12">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#17a2b8] via-[#F7941D] to-[#ED1C24] animate-progress"></div>
                </div>
            </div>

            {/* Astuces rotatives */}
            <div className="max-w-md text-center">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#17a2b8] to-[#F7941D] flex items-center justify-center">
                                <Sparkle size={16} weight="fill" className="text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                                Le saviez-vous ?
                            </p>
                            <p
                                key={currentTip}
                                className="text-gray-700 text-sm leading-relaxed animate-fade-in"
                            >
                                {tips[currentTip]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Indicateur de tips */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {tips.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentTip
                                ? "w-8 bg-gradient-to-r from-[#17a2b8] to-[#F7941D]"
                                : "w-1.5 bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Styles d'animation personnalisés */}
            <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
        </div>
    );
}
