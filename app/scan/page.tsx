"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Lightning, Gear, Barcode, Receipt, Camera } from "phosphor-react";

export default function ScanPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"barcode" | "meal" | "recipe">("meal");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    requestCameraPermission();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (hasPermission && facingMode) {
      startCamera();
    }
  }, [facingMode, hasPermission]);

  const requestCameraPermission = async () => {
    try {
      console.log('🔵 [SCANNER] Demande d\'autorisation caméra...');
      console.log('🔵 [SCANNER] User Agent:', navigator.userAgent);
      console.log('🔵 [SCANNER] Protocol:', window.location.protocol);
      console.log('🔵 [SCANNER] Hostname:', window.location.hostname);
      console.log('🔵 [SCANNER] navigator.mediaDevices disponible:', !!navigator.mediaDevices);
      console.log('🔵 [SCANNER] getUserMedia disponible:', !!(navigator.mediaDevices?.getUserMedia));
      
      // Vérifier si l'API est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('❌ [SCANNER] navigator.mediaDevices non disponible');
        
        // Diagnostiquer la cause
        let errorMessage = 'Caméra non disponible. ';
        
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          errorMessage += 'HTTPS requis : Cette fonctionnalité nécessite une connexion sécurisée (HTTPS).';
        } else if (!navigator.mediaDevices) {
          errorMessage += 'Votre navigateur ne supporte pas l\'accès à la caméra. Veuillez utiliser Chrome, Safari ou Firefox récent.';
        } else {
          errorMessage += 'Fonctionnalité non disponible sur cet appareil.';
        }
        
        console.error('❌ [SCANNER] Raison:', errorMessage);
        alert(errorMessage);
        setHasPermission(false);
        return;
      }
      
      // Demander l'autorisation de la caméra avec un stream de test
      const testStream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      console.log('✅ [SCANNER] Autorisation accordée');
      setHasPermission(true);
      
      // Arrêter le stream de test
      testStream.getTracks().forEach(track => track.stop());
      
      // Récupérer la liste des caméras disponibles
      await loadAvailableCameras();
      
      // Démarrer la caméra avec les bonnes contraintes
      startCamera();
    } catch (err) {
      console.error('❌ [SCANNER] Erreur d\'autorisation:', err);
      setHasPermission(false);
    }
  };

  const loadAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      console.log('🔵 [SCANNER] Caméras disponibles:', cameras);
      
      // Sélectionner la caméra arrière par défaut si disponible
      const backCamera = cameras.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('arrière') ||
        camera.label.toLowerCase().includes('rear') ||
        camera.label.toLowerCase().includes('environment')
      );
      
      if (backCamera) {
        console.log('✅ [SCANNER] Caméra arrière trouvée:', backCamera.label);
      }
    } catch (err) {
      console.error('❌ [SCANNER] Erreur lors de la récupération des caméras:', err);
    }
  };

  const startCamera = async () => {
    try {
      // Arrêter le stream précédent s'il existe
      stopCamera();

      console.log('🔵 [SCANNER] Démarrage de la caméra avec facingMode:', facingMode);
      
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      setStream(mediaStream);
      console.log('✅ [SCANNER] Caméra démarrée avec succès');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("❌ [SCANNER] Erreur lors du démarrage de la caméra:", error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      console.log('🔵 [SCANNER] Arrêt de la caméra');
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    router.back();
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;

    setIsAnalyzing(true);

    try {
      // Créer un canvas pour capturer l'image
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        
        // Convertir en blob
        canvas.toBlob((blob) => {
          if (blob) {
            console.log("Image capturée:", blob);
            // TODO: Envoyer l'image à l'API d'analyse
          }
        }, "image/jpeg", 0.95);
      }

      // Simuler l'analyse
      setTimeout(() => {
        setIsAnalyzing(false);
        // TODO: Rediriger vers la page de résultats
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la capture:", error);
      setIsAnalyzing(false);
    }
  };

  const handleFlipCamera = () => {
    console.log('🔵 [SCANNER] Changement de caméra');
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
  };

  const handleGallery = () => {
    // TODO: Ouvrir la galerie pour sélectionner une image
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("Image sélectionnée:", file);
        // TODO: Analyser l'image sélectionnée
      }
    };
    input.click();
  };

  // État de demande d'autorisation
  if (hasPermission === null) {
    return (
      <div className="relative h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-16 w-16 text-[#F7941D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-xl font-semibold">Demande d&apos;autorisation...</p>
          <p className="text-gray-400 text-center">Veuillez autoriser l&apos;accès à la caméra</p>
        </div>
      </div>
    );
  }

  // Afficher un message si la permission est refusée
  if (hasPermission === false) {
    return (
      <div className="relative h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
          <h1 className="text-white text-xl font-semibold">Scanner</h1>
          <div className="w-10"></div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center">
              <Camera size={32} weight="bold" className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Accès à la caméra requis
            </h2>
            <p className="text-gray-600 mb-6">
              Pour scanner vos repas, nous avons besoin d&apos;accéder à votre caméra. 
              Veuillez autoriser l&apos;accès dans les paramètres de votre navigateur.
            </p>
            <div className="space-y-3">
              <button
                onClick={requestCameraPermission}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Réessayer
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X size={24} weight="bold" />
        </button>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
            <Lightning size={24} weight="fill" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
            <Gear size={24} weight="fill" />
          </button>
        </div>
      </header>

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <div className="relative z-10 flex items-center justify-center mt-8">
          <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#17a2b8] animate-pulse"></div>
            <span className="text-white font-medium">Analyse en cours...</span>
          </div>
        </div>
      )}

      {/* Scan frame */}
      <div className="relative z-10 flex items-center justify-center" style={{ height: 'calc(100vh - 300px)' }}>
        <div className="relative w-[90%] max-w-md aspect-[4/3]">
          {/* Corner borders with neon effect */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#17a2b8" />
                <stop offset="100%" stopColor="#17a2b8" />
              </linearGradient>
              <filter id="scan-glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Top-left corner */}
            <path
              d="M 5 20 L 5 5 L 20 5"
              fill="none"
              stroke="url(#scan-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#scan-glow)"
            />
            
            {/* Top-right corner */}
            <path
              d="M 80 5 L 95 5 L 95 20"
              fill="none"
              stroke="url(#scan-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#scan-glow)"
            />
            
            {/* Bottom-left corner */}
            <path
              d="M 5 80 L 5 95 L 20 95"
              fill="none"
              stroke="url(#scan-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#scan-glow)"
            />
            
            {/* Bottom-right corner */}
            <path
              d="M 80 95 L 95 95 L 95 80"
              fill="none"
              stroke="url(#scan-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#scan-glow)"
            />
          </svg>

          {/* Scanning line animation */}
          {isAnalyzing && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#17a2b8] to-transparent animate-scan-line"></div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-8">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <button
            onClick={() => setActiveTab("barcode")}
            className={`flex flex-col items-center gap-2 transition-colors ${
              activeTab === "barcode" ? "text-white" : "text-white/50"
            }`}
          >
            <Barcode size={28} weight={activeTab === "barcode" ? "fill" : "regular"} />
            <span className="text-xs font-medium uppercase tracking-wider">Code barres</span>
          </button>

          <button
            onClick={() => setActiveTab("meal")}
            className={`flex flex-col items-center gap-2 transition-colors ${
              activeTab === "meal" ? "text-white" : "text-white/50"
            }`}
          >
            <Camera size={28} weight={activeTab === "meal" ? "fill" : "regular"} />
            <span className="text-xs font-medium uppercase tracking-wider">Repas</span>
          </button>

          <button
            onClick={() => setActiveTab("recipe")}
            className={`flex flex-col items-center gap-2 transition-colors ${
              activeTab === "recipe" ? "text-white" : "text-white/50"
            }`}
          >
            <Receipt size={28} weight={activeTab === "recipe" ? "fill" : "regular"} />
            <span className="text-xs font-medium uppercase tracking-wider">Recette</span>
          </button>
        </div>

        {/* Capture button */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={handleGallery}
            className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>

          <button
            onClick={handleCapture}
            disabled={isAnalyzing}
            className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] shadow-lg shadow-[#662D91]/30"></div>
            </div>
          </button>

          <button
            onClick={handleFlipCamera}
            className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
