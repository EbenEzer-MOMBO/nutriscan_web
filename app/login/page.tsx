"use client";

import Image from "next/image";
import { GoogleLogo, AppleLogo } from "phosphor-react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est installée
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstalled();

    // Vérifier périodiquement (au cas où l'utilisateur installe pendant qu'il est sur la page)
    const interval = setInterval(checkInstalled, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    // TODO: Implémenter la connexion Google
    console.log("Connexion avec Google");
  };

  const handleAppleLogin = () => {
    // TODO: Implémenter la connexion Apple
    console.log("Connexion avec Apple");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slide1.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* White overlay */}
        <div className="absolute inset-0 bg-white/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-6 relative w-32 h-32">
            <Image
              src="/logo_nutriscan.png"
              alt="Nutriscan Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ED1C24] to-[#F7941D] bg-clip-text text-transparent mb-2">
            Nutriscan
          </h1>
          <p className="text-gray-600 text-center">
            Suivez vos calories avec l'IA
          </p>
        </div>

        {/* Login buttons container */}
        <div className="w-full max-w-sm space-y-6">
          {!isInstalled ? (
            // Message d'installation si l'app n'est pas installée
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center shadow-lg shadow-[#662D91]/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Installez l'application
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Pour une meilleure expérience, installez Nutriscan sur votre appareil. 
                Cliquez sur le bouton ci-dessous pour commencer !
              </p>
            </div>
          ) : (
            // Boutons de connexion si l'app est installée
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Connectez-vous
                </h2>
                <p className="text-gray-600">
                  Choisissez votre méthode de connexion
                </p>
              </div>

              {/* Google login button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <GoogleLogo size={24} weight="bold" className="text-[#4285F4]" />
                <span className="font-semibold text-gray-800">
                  Continuer avec Google
                </span>
              </button>

              {/* Apple login button */}
              <button
                onClick={handleAppleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-black border-2 border-black shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <AppleLogo size={24} weight="fill" className="text-white" />
                <span className="font-semibold text-white">
                  Continuer avec Apple
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Terms and conditions */}
        <p className="mt-8 text-xs text-gray-500 text-center max-w-sm">
          En continuant, vous acceptez nos{" "}
          <a href="#" className="text-[#ED1C24] hover:underline">
            Conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-[#ED1C24] hover:underline">
            Politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
}
