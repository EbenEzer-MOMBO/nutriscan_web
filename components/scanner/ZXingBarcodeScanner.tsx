"use client";

import { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

interface ZXingBarcodeScannerProps {
    onBarcodeDetected: (barcode: string) => void;
    onError?: (error: string) => void;
    isActive: boolean;
    isTorchOn?: boolean;
}

export default function ZXingBarcodeScanner({
    onBarcodeDetected,
    onError,
    isActive,
    isTorchOn = false,
}: ZXingBarcodeScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [lastScannedCode, setLastScannedCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (!isActive) {
            stopScanner();
            return;
        }

        startScanner();

        return () => {
            stopScanner();
        };
    }, [isActive]);

    // Contrôler la torche
    useEffect(() => {
        const toggleTorch = async () => {
            if (!streamRef.current) {
                console.log("⚠️ [TORCH] Stream non disponible");
                return;
            }

            const track = streamRef.current.getVideoTracks()[0];
            if (!track) {
                console.log("⚠️ [TORCH] Aucune piste vidéo trouvée");
                return;
            }

            try {
                const capabilities = track.getCapabilities() as any;

                if (!capabilities.torch) {
                    console.log("⚠️ [TORCH] La torche n'est pas supportée sur cet appareil");
                    return;
                }

                await track.applyConstraints({
                    advanced: [{ torch: isTorchOn } as any]
                });

                console.log(`🔦 [TORCH] Torche ${isTorchOn ? 'allumée' : 'éteinte'}`);
            } catch (err) {
                console.error("❌ [TORCH] Erreur lors du contrôle de la torche:", err);
            }
        };

        toggleTorch();
    }, [isTorchOn]);

    const startScanner = async () => {
        try {
            if (!videoRef.current) {
                console.log("❌ [ZXING] videoRef n'est pas disponible");
                return;
            }

            console.log("🔵 [ZXING] Démarrage du scanner");

            const codeReader = new BrowserMultiFormatReader();
            codeReaderRef.current = codeReader;

            console.log("🔵 [ZXING] Tentative d'accès à la caméra...");

            // Utiliser directement les contraintes sans lister les devices
            // Cela évite les problèmes de permissions
            await codeReader.decodeFromConstraints(
                {
                    video: {
                        facingMode: { ideal: "environment" }
                    }
                },
                videoRef.current,
                (result, error) => {
                    if (result) {
                        const code = result.getText();

                        // Éviter les détections multiples du même code
                        if (code && code !== lastScannedCode) {
                            console.log("✅ [ZXING] Code détecté:", code);
                            setLastScannedCode(code);
                            onBarcodeDetected(code);
                        }
                    }

                    if (error && !(error instanceof NotFoundException)) {
                        // Ignorer les erreurs "NotFoundException" qui sont normales
                        // console.error("❌ [ZXING] Erreur de scan:", error);
                    }
                }
            );

            // Capturer le stream pour pouvoir contrôler la torche
            if (videoRef.current && videoRef.current.srcObject) {
                streamRef.current = videoRef.current.srcObject as MediaStream;
                console.log("✅ [ZXING] Stream capturé pour contrôle de la torche");
            }

            setIsScanning(true);
            console.log("✅ [ZXING] Scanner démarré avec succès");
        } catch (err) {
            console.error("❌ [ZXING] Erreur lors du démarrage:", err);
            console.error("❌ [ZXING] Détails de l'erreur:", JSON.stringify(err, null, 2));
            setIsScanning(false);
            const errorMsg = `Erreur d'accès à la caméra: ${err}`;
            setErrorMessage(errorMsg);
            if (onError) {
                onError(errorMsg);
            }
        }
    };

    const stopScanner = () => {
        if (codeReaderRef.current) {
            console.log("🔵 [ZXING] Arrêt du scanner");
            codeReaderRef.current.reset();
            codeReaderRef.current = null;
            streamRef.current = null;
            setIsScanning(false);
        }
    };

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
            />

            {isScanning && (
                <div className="absolute bottom-32 left-0 right-0 flex justify-center z-30">
                    <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#17a2b8] animate-pulse"></div>
                        <span className="text-white font-medium text-sm">
                            Recherche de code-barres...
                        </span>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="absolute top-1/2 left-0 right-0 flex justify-center z-30 px-4">
                    <div className="bg-red-500/90 backdrop-blur-md rounded-2xl px-6 py-4 max-w-md">
                        <p className="text-white font-medium text-center">
                            {errorMessage}
                        </p>
                        <p className="text-white/80 text-sm text-center mt-2">
                            Vérifiez les permissions de la caméra dans votre navigateur
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
