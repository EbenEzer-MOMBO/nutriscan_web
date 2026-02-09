"use client";

import { UserProfile } from "@/lib/types/profile";
import { Fire, Barbell, Cookie, Drop, TrendUp, Target } from "phosphor-react";

interface ProfileSummaryProps {
    profile: UserProfile;
}

const GOAL_CONFIG = {
    bulk: { label: "Prise de Masse", emoji: "💪", color: "blue" },
    cut: { label: "Sèche", emoji: "🔥", color: "red" },
    recomp: { label: "Recomposition", emoji: "⚡", color: "purple" },
    maintain: { label: "Maintien", emoji: "🎯", color: "green" },
};

const BMI_CONFIG = {
    underweight: { label: "Sous-poids", color: "text-blue-600" },
    normal: { label: "Normal", color: "text-green-600" },
    overweight: { label: "Surpoids", color: "text-orange-600" },
    obese: { label: "Obésité", color: "text-red-600" },
};

export default function ProfileSummary({ profile }: ProfileSummaryProps) {
    const goalConfig = GOAL_CONFIG[profile.goal];
    const bmiConfig = BMI_CONFIG[profile.bmi_category];

    return (
        <div className="space-y-6">
            {/* Carte d'informations de base */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Informations Personnelles</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Âge</p>
                        <p className="text-2xl font-bold text-gray-900">{profile.age} ans</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Taille</p>
                        <p className="text-2xl font-bold text-gray-900">{profile.height} cm</p>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-gray-600 mb-1">Poids Actuel</p>
                        <p className="text-2xl font-bold text-blue-600">{profile.weight} kg</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                        <p className="text-sm text-gray-600 mb-1">IMC</p>
                        <p className={`text-2xl font-bold ${bmiConfig.color}`}>{profile.bmi.toFixed(1)}</p>
                        <p className="text-xs text-gray-500 mt-1">{bmiConfig.label}</p>
                    </div>
                </div>

                {/* Objectif de poids */}
                {profile.target_weight && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10 rounded-xl border border-orange-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target size={20} className="text-[#ED1C24]" weight="fill" />
                                <span className="text-sm font-semibold text-gray-700">Objectif de poids</span>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-[#ED1C24]">{profile.target_weight} kg</p>
                                {profile.weight_difference && (
                                    <p className="text-xs text-gray-600">
                                        {profile.weight_difference > 0 ? '+' : ''}{profile.weight_difference.toFixed(1)} kg
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Objectif */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Mon Objectif</h2>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10 rounded-xl">
                    <span className="text-3xl">{goalConfig.emoji}</span>
                    <div>
                        <p className="font-bold text-gray-900">{goalConfig.label}</p>
                        <p className="text-sm text-gray-600 capitalize">
                            Morphologie: {profile.body_type} • Activité: {profile.activity_level}
                        </p>
                    </div>
                </div>
            </div>

            {/* Objectifs nutritionnels */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Fire size={24} weight="fill" className="text-[#F7941D]" />
                    Objectifs Nutritionnels Quotidiens
                </h2>

                {/* Calories */}
                <div className="text-center mb-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                    <p className="text-5xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent">
                        {profile.daily_targets.calories}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Calories / jour</p>
                </div>

                {/* Macronutriments */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3">
                            <Barbell size={24} weight="fill" className="text-blue-600" />
                            <span className="font-semibold text-gray-900">Protéines</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{profile.daily_targets.proteins}g</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-3">
                            <Cookie size={24} weight="fill" className="text-amber-600" />
                            <span className="font-semibold text-gray-900">Glucides</span>
                        </div>
                        <span className="text-xl font-bold text-amber-600">{profile.daily_targets.carbs}g</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                        <div className="flex items-center gap-3">
                            <Drop size={24} weight="fill" className="text-rose-600" />
                            <span className="font-semibold text-gray-900">Lipides</span>
                        </div>
                        <span className="text-xl font-bold text-rose-600">{profile.daily_targets.fat}g</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
