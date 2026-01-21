"use client";

import Image from "next/image";
import { Bell } from "phosphor-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  // Récupérer les initiales du nom
  const getInitials = (name: string) => {
    if (!name) return "N";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center overflow-hidden">
          {user?.profile_photo_url ? (
            <Image 
              src={user.profile_photo_url} 
              alt={user.name || "Profile"} 
              width={40} 
              height={40} 
              className="object-cover w-full h-full" 
            />
          ) : (
            <span className="text-white font-bold text-lg">
              {user ? getInitials(user.name) : "N"}
            </span>
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
