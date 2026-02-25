"use client";

import { Bell, User } from "phosphor-react";
import { useAuth } from "@/hooks/useAuth";
import { getProfilePhotoUrl, getInitials } from "@/lib/image.utils";
import Image from "next/image";

export default function Header() {
  const { user } = useAuth();

  // Obtenir l'URL de la photo corrigée
  const photoUrl = user ? getProfilePhotoUrl(user) : null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <Image 
              src={photoUrl} 
              alt={user?.name || "Profile"} 
              width={40} 
              height={40} 
              className="object-cover w-full h-full" 
            />
          ) : (
            <User size={24} weight="fill" className="text-white" />
          )}
        </div>
      </div>
      
      <h1 className="text-xl font-bold text-gray-900">Nutriscan</h1>
      
      <button className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
        <Bell size={24} weight="regular" />
      </button>
    </header>
  );
}
