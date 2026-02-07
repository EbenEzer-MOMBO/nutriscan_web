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
      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center text-center gap-3"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-[#F7941D] to-[#FF8C00] rounded-2xl flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-900 font-bold text-base mb-1">{title}</h3>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </button>
  );
}
