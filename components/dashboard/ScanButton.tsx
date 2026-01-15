"use client";

interface ScanButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export default function ScanButton({ icon, title, subtitle, onClick }: ScanButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border-2 border-[#F7941D] rounded-2xl p-4 shadow-lg hover:shadow-xl hover:shadow-[#F7941D]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-4 text-left"
    >
      <div className="w-12 h-12 bg-white border-2 border-[#F7941D] rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-gray-900 font-bold text-lg mb-0.5">{title}</h3>
        <p className="text-[#F7941D] text-sm font-medium">{subtitle}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-6 h-6 text-[#F7941D] flex-shrink-0"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}
