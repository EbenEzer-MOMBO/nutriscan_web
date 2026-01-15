"use client";

import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <main className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tendances</h1>
        <p className="text-gray-600">Vos statistiques et tendances apparaîtront ici.</p>
      </main>
      
      <BottomNav />
    </div>
  );
}
