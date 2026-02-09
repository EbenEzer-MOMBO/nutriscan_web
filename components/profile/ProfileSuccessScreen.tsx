"use client";

import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types/profile";
import { Fire, Barbell, Cookie, Drop, Check, Sparkle } from "phosphor-react";
import { useState } from "react";

interface ProfileSuccessScreenProps {
    profile: UserProfile;
}

const GOAL_CONFIG = {
    bulk: { label: "Prise de Masse", emoji: "💪", message: "Prêt à devenir une machine !" },
    cut: { label: "Sèche", emoji: "🔥", message: "Let's get shredded !" },
    recomp: { label: "Recomposition", emoji: "⚡", message: "Transformation en cours !" },
    maintain: { label: "Maintien", emoji: "🎯", message: "On garde la forme !" },
};

export default function ProfileSuccessScreen({ profile }: ProfileSuccessScreenProps) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);
    const goalConfig = GOAL_CONFIG[profile.goal];

    const handleContinue = () => {
        setIsNavigating(true);
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full space-y-6 animate-fade-in">
                {/* Success Icon */}
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Check size={48} weight="bold" className="text-white" />
                        </div>
                        <Sparkle
                            size={24}
                            weight="fill"
                            className="absolute -top-2 -right-2 text-[#F7941D] animate-pulse"
                        />
                        <Sparkle
                            size={20}
                            weight="fill"
                            className="absolute -bottom-1 -left-1 text-[#ED1C24] animate-pulse"
                            style={{ animationDelay: '0.3s' }}
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil créé !</h1>
                    <p className="text-gray-600 mb-1">{goalConfig.message}</p>
                    <p className="text-sm text-gray-500">Tes objectifs sont prêts 🎯</p>
                </div>

                {/* Objectif */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{goalConfig.emoji}</span>
                        <div>
                            <p className="text-sm text-gray-600">Ton objectif</p>
                            <p className="text-xl font-bold text-gray-900">{goalConfig.label}</p>
                        </div>
                    </div>
                </div>

                {/* Calories */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Fire size={24} weight="fill" className="text-[#F7941D]" />
                        <h2 className="text-lg font-bold text-gray-900">Objectif Calorique</h2>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                        <p className="text-6xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent">
                            {profile.daily_targets.calories}
                        </p>
                        <p className="text-sm text-gray-600 mt-2 font-medium">kcal / jour</p>
                    </div>
                </div>

                {/* Macronutriments */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tes Macros</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <Barbell size={24} weight="fill" className="text-blue-600" />
                                <span className="font-semibold text-gray-900">Protéines</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">{profile.daily_targets.proteins}g</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-3">
                                <Cookie size={24} weight="fill" className="text-amber-600" />
                                <span className="font-semibold text-gray-900">Glucides</span>
                            </div>
                            <span className="text-2xl font-bold text-amber-600">{profile.daily_targets.carbs}g</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                            <div className="flex items-center gap-3">
                                <Drop size={24} weight="fill" className="text-rose-600" />
                                <span className="font-semibold text-gray-900">Lipides</span>
                            </div>
                            <span className="text-2xl font-bold text-rose-600">{profile.daily_targets.fat}g</span>
                        </div>
                    </div>
                </div>

                {/* Bouton Continuer */}
                <button
                    onClick={handleContinue}
                    disabled={isNavigating}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all active:scale-98 disabled:opacity-50"
                >
                    {isNavigating ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span>Chargement...</span>
                        </div>
                    ) : (
                        "C'est parti ! 🚀"
                    )}
                </button>
            </div>
        </div>
    );
}
