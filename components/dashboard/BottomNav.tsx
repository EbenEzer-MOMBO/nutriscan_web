"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, BookOpen, Plus, TrendUp, Gear } from "phosphor-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (active: boolean) => (
        <House size={24} weight={active ? "fill" : "regular"} />
      ),
    },
    {
      name: "Journal",
      path: "/journal",
      icon: (active: boolean) => (
        <BookOpen size={24} weight={active ? "fill" : "regular"} />
      ),
    },
    {
      name: "Ajouter",
      path: "/add",
      icon: (_active: boolean) => (
        <Plus size={32} weight="bold" />
      ),
      isCenter: true,
    },
    {
      name: "Tendances",
      path: "/trends",
      icon: (active: boolean) => (
        <TrendUp size={24} weight={active ? "fill" : "regular"} />
      ),
    },
    {
      name: "Réglages",
      path: "/settings",
      icon: (active: boolean) => (
        <Gear size={24} weight={active ? "fill" : "regular"} />
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-40">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          if (item.isCenter) {
            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex flex-col items-center relative -top-6"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center shadow-lg shadow-[#662D91]/30 text-white">
                  {item.icon(false)}
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.path}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <div className={isActive ? "text-[#ED1C24]" : "text-gray-400"}>
                {item.icon(isActive)}
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-[#ED1C24]" : "text-gray-500"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
