"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "phosphor-react";

interface ProfileData {
  gender: "male" | "female" | "";
  age: string;
  weight: string;
  height: string;
  bodyType: "ectomorph" | "mesomorph" | "endomorph" | "";
  goal: "bulk" | "cut" | "recomp" | "maintain" | "";
}

export default function OnboardingProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [profileData, setProfileData] = useState<ProfileData>({
    gender: "",
    age: "",
    weight: "",
    height: "",
    bodyType: "",
    goal: "",
  });

  useEffect(() => {
    // Empêcher le geste de retour natif sur mobile
    const preventSwipeBack = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      const isLeftEdge = touch.clientX < 20;
      if (isLeftEdge) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventSwipeBack, { passive: false });
    return () => {
      document.removeEventListener('touchstart', preventSwipeBack);
    };
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profileData.gender !== "" && profileData.age !== "";
      case 2:
        return profileData.weight !== "" && profileData.height !== "";
      case 3:
        return profileData.bodyType !== "";
      case 4:
        return profileData.goal !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Sauvegarder les données et retourner au profil
      console.log("Profile data:", profileData);
      router.push("/settings");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors active:scale-90"
          >
            <ArrowLeft size={24} weight="bold" className="text-gray-700" />
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-gray-900">Configuration du Profil</h1>
            <p className="text-sm text-gray-500">Étape {currentStep}/{totalSteps}</p>
          </div>
          
          <div className="w-10" />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {/* Step 1: Gender & Age */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations de Base</h2>
              <p className="text-gray-600">Commençons par les informations essentielles</p>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Sexe</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setProfileData({ ...profileData, gender: "male" })}
                  className={`py-4 px-6 rounded-2xl border-2 font-semibold transition-all active:scale-95 ${
                    profileData.gender === "male"
                      ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10 text-[#ED1C24]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  👨 Homme
                </button>
                <button
                  onClick={() => setProfileData({ ...profileData, gender: "female" })}
                  className={`py-4 px-6 rounded-2xl border-2 font-semibold transition-all active:scale-95 ${
                    profileData.gender === "female"
                      ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10 text-[#ED1C24]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  👩 Femme
                </button>
              </div>
            </div>

            {/* Age Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Âge</label>
              <input
                type="number"
                placeholder="Ex: 25"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                className="w-full py-4 px-6 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-semibold text-lg focus:border-[#ED1C24] focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">Votre âge en années</p>
            </div>
          </div>
        )}

        {/* Step 2: Weight & Height */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mesures Corporelles</h2>
              <p className="text-gray-600">Indiquez vos mesures actuelles</p>
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Poids Actuel</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                  className="w-full py-4 px-6 pr-16 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-semibold text-lg focus:border-[#ED1C24] focus:outline-none transition-colors"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">kg</span>
              </div>
            </div>

            {/* Height Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Taille</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ex: 175"
                  value={profileData.height}
                  onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                  className="w-full py-4 px-6 pr-16 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-semibold text-lg focus:border-[#ED1C24] focus:outline-none transition-colors"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">cm</span>
              </div>
            </div>

            {/* BMI Preview */}
            {profileData.weight && profileData.height && (
              <div className="bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Votre IMC</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent">
                  {(parseFloat(profileData.weight) / Math.pow(parseFloat(profileData.height) / 100, 2)).toFixed(1)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Body Type */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Type de Morphologie</h2>
              <p className="text-gray-600">Sélectionnez votre type morphologique</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setProfileData({ ...profileData, bodyType: "ectomorph" })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                  profileData.bodyType === "ectomorph"
                    ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Ectomorphe</h3>
                    <p className="text-sm text-gray-600">Morphologie fine, métabolisme rapide, difficulté à prendre du poids</p>
                  </div>
                  {profileData.bodyType === "ectomorph" && (
                    <Check size={24} weight="bold" className="text-[#ED1C24] ml-3" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setProfileData({ ...profileData, bodyType: "mesomorph" })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                  profileData.bodyType === "mesomorph"
                    ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Mésomorphe</h3>
                    <p className="text-sm text-gray-600">Morphologie athlétique, prend du muscle facilement, métabolisme équilibré</p>
                  </div>
                  {profileData.bodyType === "mesomorph" && (
                    <Check size={24} weight="bold" className="text-[#ED1C24] ml-3" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setProfileData({ ...profileData, bodyType: "endomorph" })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                  profileData.bodyType === "endomorph"
                    ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Endomorphe</h3>
                    <p className="text-sm text-gray-600">Morphologie ronde, prend du poids facilement, métabolisme lent</p>
                  </div>
                  {profileData.bodyType === "endomorph" && (
                    <Check size={24} weight="bold" className="text-[#ED1C24] ml-3" />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Goal */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre Objectif</h2>
              <p className="text-gray-600">Que souhaitez-vous accomplir ?</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setProfileData({ ...profileData, goal: "cut" })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                  profileData.goal === "cut"
                    ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🔥</span>
                      <h3 className="font-bold text-lg text-gray-900">Perte de Gras (Sèche)</h3>
                    </div>
                    <p className="text-sm text-gray-600">Réduire le taux de masse grasse tout en préservant le muscle</p>
                  </div>
                  {profileData.goal === "cut" && (
                    <Check size={24} weight="bold" className="text-[#ED1C24] ml-3" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setProfileData({ ...profileData, goal: "bulk" })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                  profileData.goal === "bulk"
                    ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">💪</span>
                      <h3 className="font-bold text-lg text-gray-900">Prise de Masse</h3>
                    </div>
                    <p className="text-sm text-gray-600">Augmenter le poids et la masse musculaire globale</p>
                  </div>
                  {profileData.goal === "bulk" && (
                    <Check size={24} weight="bold" className="text-[#ED1C24] ml-3" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setProfileData({ ...profileData, goal: "recomp" })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                  profileData.goal === "recomp"
                    ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">⚡</span>
                      <h3 className="font-bold text-lg text-gray-900">Recomposition (Muscle Pur)</h3>
                    </div>
                    <p className="text-sm text-gray-600">Perdre du gras et gagner du muscle simultanément</p>
                  </div>
                  {profileData.goal === "recomp" && (
                    <Check size={24} weight="bold" className="text-[#ED1C24] ml-3" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setProfileData({ ...profileData, goal: "maintain" })}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                  profileData.goal === "maintain"
                    ? "border-[#ED1C24] bg-gradient-to-r from-[#ED1C24]/10 to-[#F7941D]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🎯</span>
                      <h3 className="font-bold text-lg text-gray-900">Maintien</h3>
                    </div>
                    <p className="text-sm text-gray-600">Maintenir votre poids et composition corporelle actuelle</p>
                  </div>
                  {profileData.goal === "maintain" && (
                    <Check size={24} weight="bold" className="text-[#ED1C24] ml-3" />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Navigation */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            canProceed()
              ? "bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white shadow-lg shadow-orange-500/30 active:scale-98"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {currentStep === totalSteps ? (
            <>
              <Check size={24} weight="bold" />
              <span>Terminer</span>
            </>
          ) : (
            <>
              <span>Continuer</span>
              <ArrowRight size={24} weight="bold" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
