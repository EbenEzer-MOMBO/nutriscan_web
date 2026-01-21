"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth.service";

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = () => {
      if (isAuthenticated()) {
        // Rediriger vers le dashboard si connecté
        router.push("/dashboard");
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const steps = [
    {
      title: "Scannez vos repas",
      description: "Grâce à notre IA de pointe, identifiez instantanément les calories et nutriments de votre assiette d'une simple photo.",
      image: "/slide1.jpg",
    },
    {
      title: "Suivez vos progrès",
      description: "Visualisez votre évolution avec des graphiques détaillés et des statistiques personnalisées pour atteindre vos objectifs.",
      image: "/slide2.jpg",
    },
    {
      title: "Atteignez vos objectifs",
      description: "Recevez des recommandations personnalisées et des conseils nutritionnels adaptés à votre mode de vie.",
      image: "/slide3.jpg",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape - action de démarrage
      handleStartApp();
    }
  };

  const skipOnboarding = () => {
    handleStartApp();
  };

  const handleStartApp = () => {
    // Rediriger vers la page de connexion
    router.push("/login");
  };

  // Afficher un écran de chargement pendant la vérification
  if (isChecking) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ED1C24] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      {/* Header with title and skip button */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <h2 className="text-gray-400 text-sm font-medium">Bienvenue sur Nutriscan</h2>
        <button
          onClick={skipOnboarding}
          className="text-[#17a2b8] font-semibold text-sm hover:text-[#138496] transition-colors"
        >
          Passer
        </button>
      </div>

      {/* Content area - flexible to fill remaining space and center vertically */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-6 overflow-hidden">
        {/* Image with rounded corners and shadow */}
        <div className="relative w-full flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg mb-6" style={{ height: '45%' }}>
          <Image
            src={steps[currentStep].image}
            alt={steps[currentStep].title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3 flex-shrink-0">
          {steps[currentStep].title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center leading-relaxed mb-6 flex-shrink-0 px-2">
          {steps[currentStep].description}
        </p>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6 flex-shrink-0">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-gradient-to-r from-[#ED1C24] to-[#F7941D]"
                  : "w-1 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={nextStep}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold text-lg shadow-lg shadow-[#662D91]/20 hover:shadow-xl hover:shadow-[#662D91]/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0 mb-20"
        >
          {currentStep === steps.length - 1 ? "Commencer" : "Continuer"}
        </button>
      </div>
    </div>
  );
}
