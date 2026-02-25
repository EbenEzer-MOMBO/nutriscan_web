"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/hooks/use-queries";
import BottomNav from "@/components/dashboard/BottomNav";
import { Bell, Lock, Question, CheckCircle, CaretRight, Fire, SignOut, User, X, Warning } from "phosphor-react";
import Image from "next/image";
import { getProfilePhotoUrl, getInitials } from "@/lib/image.utils";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { data: profileResult, isLoading: profileLoading } = useProfile();
  const profile = profileResult?.success ? profileResult.data : null;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  // Formater la date d'inscription
  const getRegistrationDate = () => {
    // Pour l'instant, utiliser une date fictive
    // TODO: Ajouter created_at dans les données utilisateur du backend
    return "Janvier 2024";
  };

  // Obtenir l'URL de la photo corrigée
  const photoUrl = user ? getProfilePhotoUrl(user) : null;

  // Gérer la déconnexion avec confirmation
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ED1C24] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="px-6 py-6 space-y-6">
        {/* Profile header */}
        <div className="flex flex-col items-center pt-4">
          <div className="relative mb-4">
            {photoUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                <Image
                  src={photoUrl}
                  alt={user?.name || "Profile"}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center shadow-lg">
                <User size={48} weight="fill" className="text-white" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#17a2b8] border-4 border-white flex items-center justify-center">
              <CheckCircle size={16} weight="fill" className="text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {user?.name || "Utilisateur"}
          </h1>
          <p className="text-sm text-gray-600 mb-2">{user?.email || ""}</p>
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#17a2b8]/20 to-[#17a2b8]/10 text-[#17a2b8] text-sm font-semibold mb-2">
            {user?.role === "premium" ? "Membre Premium" : "Membre Gratuit"}
          </span>
          <p className="text-sm text-gray-500">
            Inscrit depuis {getRegistrationDate()}
          </p>
        </div>

        {/* Calorie objective card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Objectif calorique</h3>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.daily_targets.calories 
                  ? `${profile.daily_targets.calories.toLocaleString('fr-FR')} kcal / jour`
                  : "Non défini"
                }
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#17a2b8]/10 flex items-center justify-center">
              <Fire size={24} weight="fill" className="text-[#17a2b8]" />
            </div>
          </div>
          <button 
            onClick={() => router.push("/onboarding-profile")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-semibold hover:opacity-90 transition-all active:scale-98"
          >
            Modifier
          </button>
        </div>

        {/* Premium card - Only show if not premium */}
        {user?.role !== "premium" && (
          <div className="bg-gradient-to-br from-[#662D91] to-[#662D91]/80 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Passer en Premium</h3>
              <p className="text-white/90 text-sm mb-6">
                Débloquez l&apos;IA et le scanner illimité
              </p>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                S&apos;abonner
              </button>
            </div>
          </div>
        )}

        {/* Settings section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Paramètres</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <SettingsItem
              icon={<Bell size={24} weight="fill" className="text-[#F7941D]" />}
              title="Notifications"
              onClick={() => console.log("Notifications")}
            />
            <SettingsItem
              icon={<Lock size={24} weight="fill" className="text-[#662D91]" />}
              title="Confidentialité"
              onClick={() => console.log("Confidentialité")}
            />
            <SettingsItem
              icon={<Question size={24} weight="fill" className="text-[#17a2b8]" />}
              title="Aide & Support"
              onClick={() => console.log("Aide & Support")}
            />
            <SettingsItem
              icon={<SignOut size={24} weight="fill" className="text-[#ED1C24]" />}
              title="Déconnexion"
              onClick={handleLogoutClick}
              isLast
            />
          </div>
        </div>
      </main>
      
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center">
                <Warning size={32} weight="fill" className="text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Confirmer la déconnexion
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all active:scale-98"
              >
                Annuler
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-semibold hover:opacity-90 transition-all active:scale-98"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}

function SettingsItem({ 
  icon, 
  title, 
  onClick, 
  isLast = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  onClick: () => void;
  isLast?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100 ${
        !isLast && "border-b border-gray-100"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-left font-semibold text-gray-900">{title}</span>
      <CaretRight size={20} weight="bold" className="text-gray-400" />
    </button>
  );
}
