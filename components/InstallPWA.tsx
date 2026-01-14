"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function InstallPWA() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Détecter si l'app a été installée
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  // Ne pas afficher si déjà installé ou si le prompt n'est pas disponible
  if (isInstalled || !showInstallButton) {
    return null;
  }

  // Afficher différemment selon la page
  const isOnboardingPage = pathname === "/";

  if (isOnboardingPage) {
    // Sur la page d'onboarding, afficher comme bouton secondaire intégré
    return (
      <div className="fixed bottom-6 left-6 right-6 z-50 max-w-md mx-auto">
        <button
          onClick={handleInstallClick}
          className="w-full py-3 rounded-2xl border-2 border-[#ED1C24] text-[#ED1C24] bg-white font-semibold hover:bg-[#ED1C24] hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Installer l'application
        </button>
      </div>
    );
  }

  // Sur les autres pages, afficher comme bouton flottant compact
  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-semibold shadow-lg shadow-[#662D91]/30 hover:shadow-xl hover:shadow-[#662D91]/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      <span className="hidden sm:inline">Installer</span>
    </button>
  );
}
