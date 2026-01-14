"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function InstallPWA() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      console.log("App déjà installée (standalone mode)");
      setIsInstalled(true);
      return;
    }

    // Vérifier si c'est iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    if (iOS) {
      console.log("iOS détecté - affichage du bouton avec instructions");
      // Sur iOS, afficher le bouton car beforeinstallprompt n'existe pas
      setShowInstallButton(true);
    }

    const handler = (e: Event) => {
      console.log("beforeinstallprompt événement déclenché");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Détecter si l'app a été installée
    window.addEventListener("appinstalled", () => {
      console.log("App installée avec succès");
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    // Debug: vérifier après un court délai
    setTimeout(() => {
      console.log("État PWA:", {
        isInstalled,
        showInstallButton,
        hasDeferredPrompt: !!deferredPrompt,
        isStandalone,
        isIOSStandalone,
        iOS,
        userAgent: navigator.userAgent,
      });
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    // Sur iOS, afficher les instructions
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      console.log("Pas de prompt disponible");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  // Ne pas afficher si déjà installé
  if (isInstalled) {
    return null;
  }

  // Ne pas afficher si pas de bouton à montrer
  if (!showInstallButton) {
    return null;
  }

  // Modal d'instructions iOS
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Installer Nutriscan sur iOS
          </h3>
          <div className="space-y-3 text-gray-700 mb-6">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white text-sm flex items-center justify-center font-bold">
                1
              </span>
              <p>Appuyez sur le bouton <strong>Partager</strong> en bas de Safari</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white text-sm flex items-center justify-center font-bold">
                2
              </span>
              <p>Sélectionnez <strong>"Sur l'écran d'accueil"</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white text-sm flex items-center justify-center font-bold">
                3
              </span>
              <p>Appuyez sur <strong>Ajouter</strong></p>
            </div>
          </div>
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Compris
          </button>
        </div>
      </div>
    );
  }

  // Afficher différemment selon la page
  const isOnboardingPage = pathname === "/";
  const isLoginPage = pathname === "/login";

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

  if (isLoginPage) {
    // Sur la page de login, afficher comme bouton principal très visible
    return (
      <div className="fixed bottom-6 left-6 right-6 z-50 max-w-sm mx-auto">
        <button
          onClick={handleInstallClick}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold text-lg shadow-2xl shadow-[#662D91]/40 hover:shadow-[#662D91]/50 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 animate-pulse-slow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Télécharger l'application
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
