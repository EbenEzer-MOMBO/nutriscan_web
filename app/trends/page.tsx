"use client";

import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";
import StatCard from "@/components/trends/StatCard";
import WeightChart from "@/components/trends/WeightChart";
import CaloriesChart from "@/components/trends/CaloriesChart";
import { Flame, TrendUp, Target, Trophy } from "phosphor-react";

export default function TrendsPage() {
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
      
      <main className="px-6 py-6 relative">
        {/* Content with blur */}
        <div className="space-y-6 blur-sm select-none pointer-events-none">
          <h1 className="text-2xl font-bold text-gray-900">Tendances</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Moyenne Cals"
              value="1950"
              unit="kcal"
              icon={<Flame size={24} weight="fill" />}
              change="-50 kcal/jour"
              changeType="positive"
            />
            
            <StatCard
              title="Poids Actuel"
              value="71.5"
              unit="kg"
              icon={<TrendUp size={24} weight="bold" />}
              change="-1.0 kg cette semaine"
              changeType="positive"
            />
            
            <StatCard
              title="Objectif Atteint"
              value="5"
              unit="/7 jours"
              icon={<Target size={24} weight="bold" />}
              change="71% de réussite"
              changeType="positive"
            />
            
            <StatCard
              title="Série Actuelle"
              value="3"
              unit="jours"
              icon={<Trophy size={24} weight="fill" />}
              change="Record: 7 jours"
              changeType="neutral"
            />
          </div>

          {/* Weight Chart */}
          <WeightChart />

          {/* Calories Chart */}
          <CaloriesChart />
        </div>

        {/* Overlay "Coming Soon" */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-gray-100 max-w-sm mx-4 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center">
              <TrendUp size={40} weight="bold" className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Bientôt Disponible
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Les statistiques détaillées et l'analyse de vos tendances seront disponibles très prochainement.
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white rounded-full font-semibold shadow-lg shadow-orange-500/30">
              <Trophy size={20} weight="fill" />
              <span>En Développement</span>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
