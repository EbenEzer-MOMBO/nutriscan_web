"use client";

import Image from "next/image";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
}

export default function Header({ userName = "Utilisateur", userAvatar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center overflow-hidden">
          {userAvatar ? (
            <Image src={userAvatar} alt={userName} width={40} height={40} className="object-cover" />
          ) : (
            <span className="text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
      
      <h1 className="text-xl font-bold text-gray-900">Nutriscan</h1>
      
      <button className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </button>
    </header>
  );
}
