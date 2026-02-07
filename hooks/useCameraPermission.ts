"use client";

import { useState, useEffect } from "react";

export function useCameraPermission() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = async () => {
        try {
            console.log('🔵 [CAMERA] Demande d\'autorisation caméra...');

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('❌ [CAMERA] navigator.mediaDevices non disponible');
                setHasPermission(false);
                return;
            }

            const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log('✅ [CAMERA] Autorisation accordée');
            setHasPermission(true);
            testStream.getTracks().forEach(track => track.stop());
        } catch (err) {
            console.error('❌ [CAMERA] Erreur d\'autorisation:', err);
            setHasPermission(false);
        }
    };

    return { hasPermission, requestPermission };
}
