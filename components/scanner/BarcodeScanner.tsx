"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
    onBarcodeDetected: (barcode: string) => void;
    onError?: (error: string) => void;
    isActive?: boolean;
}

export default function BarcodeScanner({
    onBarcodeDetected,
    onError,
    isActive = true
}: BarcodeScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [lastScannedCode, setLastScannedCode] = useState<string>("");

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

    const startScanner = async () => {
        try {
            if (scannerRef.current) {
                await stopScanner();
            }

            const scanner = new Html5Qrcode("barcode-scanner-region");
            scannerRef.current = scanner;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            };

            await scanner.start(
                { facingMode: "environment" },
                config,
                (decodedText, decodedResult) => {
                    // Éviter les détections multiples du même code
                    if (decodedText !== lastScannedCode) {
                        console.log("✅ [BARCODE] Code détecté:", decodedText);
                        setLastScannedCode(decodedText);
                        onBarcodeDetected(decodedText);

                        // Optionnel : arrêter le scanner après détection
                        // stopScanner();
                    }
                },
                (errorMessage) => {
                    // Ignorer les erreurs de scan normales (pas de code détecté)
                    // console.log("Scan en cours...", errorMessage);
                }
            );

            setIsScanning(true);
            console.log("✅ [BARCODE] Scanner démarré");
        } catch (err) {
            console.error("❌ [BARCODE] Erreur lors du démarrage du scanner:", err);
            setIsScanning(false);
            if (onError) {
                onError("Impossible de démarrer le scanner de codes-barres");
            }
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
                setIsScanning(false);
                console.log("🔵 [BARCODE] Scanner arrêté");
            } catch (err) {
                console.error("❌ [BARCODE] Erreur lors de l'arrêt du scanner:", err);
            }
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
            <div
                id="barcode-scanner-region"
                className="w-full h-full"
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
        </div>
    );
}
