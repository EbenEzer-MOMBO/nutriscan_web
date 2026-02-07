"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "phosphor-react";
import ZXingBarcodeScanner from "@/components/scanner/ZXingBarcodeScanner";
import MealScanner from "@/components/scanner/MealScanner";
import ScanHeader from "@/components/scanner/ScanHeader";
import ScanControls from "@/components/scanner/ScanControls";
import { useCameraPermission } from "@/hooks/useCameraPermission";

export default function ScanPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"barcode" | "meal">("barcode");
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  const handleClose = () => {
    router.back();
  };

  const handleCapture = async () => {
    setIsAnalyzing(true);

    try {
      // TODO: Implémenter la capture d'image pour le scan de repas
      console.log("Capture d'image pour analyse");

      setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la capture:", error);
      setIsAnalyzing(false);
    }
  };

  const handleFlipCamera = () => {
    console.log("🔵 [SCANNER] Changement de caméra");
    // TODO: Implémenter le changement de caméra
  };

  const handleGallery = () => {
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

  const handleBarcodeDetected = async (barcode: string) => {
    console.log("✅ [SCAN PAGE] Code-barres détecté:", barcode);
    setDetectedBarcode(barcode);
    setIsAnalyzing(true);

    try {
      // Importer dynamiquement le service
      const { scanProduct } = await import("@/lib/openfoodfacts.service");

      console.log("🔍 [SCAN PAGE] Appel API pour le code-barres:", barcode);
      const result = await scanProduct(barcode);

      if (result.success && result.data) {
        console.log("✅ [SCAN PAGE] Produit trouvé:", result.data.product_name);

        // Rediriger vers la page de résultats du produit
        router.push(`/product/${barcode}`);
      } else {
        console.error("❌ [SCAN PAGE] Produit non trouvé");
        alert("Produit non trouvé. Vérifiez le code-barres.");
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error("❌ [SCAN PAGE] Erreur lors du scan:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsAnalyzing(false);
    }
  };

  const handleScanError = (error: string) => {
    console.error("❌ [SCAN PAGE] Erreur de scan:", error);
  };

  const handleToggleTorch = () => {
    console.log("🔦 [SCAN PAGE] Toggle torche:", !isTorchOn);
    setIsTorchOn(!isTorchOn);
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
        <ScanHeader onClose={handleClose} />

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
                onClick={requestPermission}
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
      {/* Scanner de repas avec vidéo en arrière-plan */}
      {activeTab === "meal" && (
        <MealScanner
          isActive={activeTab === "meal"}
          isAnalyzing={isAnalyzing}
          onCapture={handleCapture}
        />
      )}

      {/* Scanner de codes-barres - prend tout l'écran */}
      {activeTab === "barcode" && (
        <div className="absolute inset-0 w-full h-full">
          <ZXingBarcodeScanner
            onBarcodeDetected={handleBarcodeDetected}
            onError={handleScanError}
            isActive={activeTab === "barcode"}
            isTorchOn={isTorchOn}
          />
        </div>
      )}

      {/* Header */}
      <ScanHeader
        onClose={handleClose}
        onToggleTorch={handleToggleTorch}
        isTorchOn={isTorchOn}
      />

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <div className="absolute top-20 left-0 right-0 z-20 flex items-center justify-center">
          <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#17a2b8] animate-pulse"></div>
            <span className="text-white font-medium">Analyse en cours...</span>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <ScanControls
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onGallery={handleGallery}
        onCapture={handleCapture}
        onFlipCamera={handleFlipCamera}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
}
