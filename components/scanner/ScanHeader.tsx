"use client";

import { X, Lightning, Flashlight } from "phosphor-react";

interface ScanHeaderProps {
    onClose: () => void;
    onToggleTorch?: () => void;
    isTorchOn?: boolean;
}

export default function ScanHeader({ onClose, onToggleTorch, isTorchOn = false }: ScanHeaderProps) {
    return (
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
            <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
            >
                <X size={24} weight="bold" />
            </button>

            <div className="flex items-center gap-3">
                <button className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
                    <Lightning size={24} weight="fill" className="text-[#F7941D]" />
                </button>
                {onToggleTorch && (
                    <button
                        onClick={onToggleTorch}
                        className={`w-10 h-10 flex items-center justify-center backdrop-blur-sm rounded-full text-white transition-colors ${isTorchOn ? 'bg-[#F7941D] hover:bg-[#F7941D]/80' : 'bg-black/50 hover:bg-black/70'
                            }`}
                    >
                        <Flashlight size={24} weight={isTorchOn ? "fill" : "regular"} />
                    </button>
                )}
            </div>
        </header>
    );
}
