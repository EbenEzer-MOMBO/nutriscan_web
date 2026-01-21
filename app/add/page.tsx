"use client";

import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";

export default function AddPage() {
  useEffect(() => {
    // Empêcher le geste de retour natif sur mobile
    const preventSwipeBack = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      
      const touch = e.touches[0];
      const isLeftEdge = touch.clientX < 20;
      
      if (isLeftEdge) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventSwipeBack, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventSwipeBack);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <main className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ajouter</h1>
        <p className="text-gray-600">Ajoutez un repas ou un aliment.</p>
      </main>
      
      <BottomNav />
    </div>
  );
}
