"use client";

import { useRef, useEffect, useState } from "react";

interface MealScannerProps {
    isActive: boolean;
    isAnalyzing: boolean;
    onCapture: () => void;
}

export default function MealScanner({ isActive, isAnalyzing, onCapture }: MealScannerProps) {
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

            const constraints = {
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("❌ [MEAL SCANNER] Erreur lors du démarrage de la caméra:", error);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject = null;
        }
    };

    if (!isActive) return null;

    return (
        <>
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
                                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
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
        </>
    );
}
