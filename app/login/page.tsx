"use client";

import Image from "next/image";
import { GoogleLogo, AppleLogo } from "phosphor-react";

export default function LoginPage() {
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
        <div className="w-full max-w-sm space-y-4">
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
