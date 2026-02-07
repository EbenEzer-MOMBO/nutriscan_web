"use client";

import { useRef, useEffect, useState } from "react";

interface SimpleBarcodeScannerProps {
    onBarcodeDetected: (barcode: string) => void;
    isActive: boolean;
}

export default function SimpleBarcodeScanner({ onBarcodeDetected, isActive }: SimpleBarcodeScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (isActive) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isActive]);

    const startCamera = async () => {
        try {
            stopCamera();

            console.log("🔵 [SIMPLE BARCODE] Démarrage de la caméra");

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            console.log("✅ [SIMPLE BARCODE] Caméra démarrée");
        } catch (error) {
            console.error("❌ [SIMPLE BARCODE] Erreur:", error);
        }
    };

    const stopCamera = () => {
        if (stream) {
            console.log("🔵 [SIMPLE BARCODE] Arrêt de la caméra");
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject = null;
        }
    };

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 w-full h-full bg-black">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
            />

            <div className="absolute bottom-32 left-0 right-0 flex justify-center z-30">
                <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3">
                    <span className="text-white font-medium text-sm">
                        Scanner simple (test) - Pas de détection automatique
                    </span>
                </div>
            </div>
        </div>
    );
}
