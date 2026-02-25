"use client";

import Image from "next/image";
import { GoogleLogo, AppleLogo } from "phosphor-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-signin-auth";
import { loginWithGoogle, loginWithApple } from "@/lib/auth.service";
import { getProfile } from "@/lib/profile.service";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "";
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "";

function LoginContent() {
  const router = useRouter();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const DEBUG = true; // Mettre à false en production

  useEffect(() => {
    // En mode debug, considérer l'app comme installée
    if (DEBUG) {
      setIsInstalled(true);
      console.log("Mode DEBUG activé - Boutons de connexion affichés");
      return;
    }

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

  // Configuration Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Token Google reçu:", tokenResponse.access_token);
        
        // Appeler l'API backend avec le token Google
        const response = await loginWithGoogle(tokenResponse.access_token);
        
        if (response.success && response.data) {
          console.log("Connexion réussie:", response.data.user);
          
          // Vérifier si l'utilisateur a un profil
          const profileResponse = await getProfile();
          
          if (profileResponse.success && profileResponse.data) {
            console.log("Profil existant trouvé, redirection vers dashboard");
            router.push("/dashboard");
          } else {
            console.log("Aucun profil trouvé, redirection vers onboarding");
            router.push("/onboarding-profile");
          }
        } else {
          setError(response.error || "Erreur lors de la connexion");
          console.error("Erreur connexion:", response.error);
        }
      } catch (err) {
        setError("Une erreur est survenue lors de la connexion");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Erreur Google OAuth:", error);
      setError("Erreur lors de la connexion avec Google");
      setIsLoading(false);
    },
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  });

  const handleGoogleLogin = () => {
    if (isLoading) return;
    googleLogin();
  };

  const handleAppleResponse = async (response: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Réponse Apple reçue:", response);
      
      if (!response.authorization) {
        throw new Error("Aucun token d'autorisation reçu d'Apple");
      }

      // Préparer les informations utilisateur si disponibles (première connexion)
      let userData = undefined;
      if (response.user) {
        userData = {
          name: {
            firstName: response.user.name?.firstName || response.user.givenName || "",
            lastName: response.user.name?.lastName || response.user.familyName || "",
          },
          email: response.user.email || "",
        };
        console.log("Première connexion Apple - Données utilisateur:", userData);
      }

      // Appeler l'API backend avec le token Apple et les données utilisateur
      const authResponse = await loginWithApple(
        response.authorization.id_token,
        userData
      );
      
      if (authResponse.success && authResponse.data) {
        console.log("Connexion Apple réussie:", authResponse.data.user);
        
        // Vérifier si l'utilisateur a un profil
        const profileResponse = await getProfile();
        
        if (profileResponse.success && profileResponse.data) {
          console.log("Profil existant trouvé, redirection vers dashboard");
          router.push("/dashboard");
        } else {
          console.log("Aucun profil trouvé, redirection vers onboarding");
          router.push("/onboarding-profile");
        }
      } else {
        setError(authResponse.error || "Erreur lors de la connexion avec Apple");
        console.error("Erreur connexion Apple:", authResponse.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion avec Apple");
      console.error("Erreur Apple:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleError = (error: any) => {
    console.error("Erreur Apple Sign In:", error);
    
    // Si l'utilisateur annule, ne pas afficher d'erreur
    if (error?.error === "popup_closed_by_user") {
      return;
    }
    
    setError("Erreur lors de la connexion avec Apple");
    setIsLoading(false);
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

        {/* Error message */}
        {error && (
          <div className="w-full max-w-sm mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm text-center font-semibold">{error}</p>
          </div>
        )}

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
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <GoogleLogo size={24} weight="bold" className="text-[#4285F4]" />
                <span className="font-semibold text-gray-800">
                  {isLoading ? "Connexion..." : "Continuer avec Google"}
                </span>
              </button>

              {/* Apple login button */}
              {APPLE_CLIENT_ID ? (
                <AppleSignin
                  authOptions={{
                    clientId: APPLE_CLIENT_ID,
                    scope: "email name",
                    redirectURI: APPLE_REDIRECT_URI,
                    state: "state",
                    nonce: "nonce",
                    usePopup: true,
                  }}
                  uiType="dark"
                  onSuccess={handleAppleResponse}
                  onError={handleAppleError}
                  skipScript={false}
                  render={(props: any) => (
                    <button
                      {...props}
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-black border-2 border-black shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <AppleLogo size={24} weight="fill" className="text-white" />
                      <span className="font-semibold text-white">
                        {isLoading ? "Connexion..." : "Continuer avec Apple"}
                      </span>
                    </button>
                  )}
                />
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gray-300 border-2 border-gray-300 cursor-not-allowed"
                >
                  <AppleLogo size={24} weight="fill" className="text-gray-500" />
                  <span className="font-semibold text-gray-500">
                    Apple Sign In non configuré
                  </span>
                </button>
              )}
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

export default function LoginPage() {
  // Vérifier si le client ID est configuré
  if (!GOOGLE_CLIENT_ID) {
    console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID n'est pas configuré");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
