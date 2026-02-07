"use client";

import { Barcode, Camera } from "phosphor-react";

interface ScanControlsProps {
    activeTab: "barcode" | "meal";
    onTabChange: (tab: "barcode" | "meal") => void;
    onGallery: () => void;
    onCapture: () => void;
    onFlipCamera: () => void;
    isAnalyzing: boolean;
}

export default function ScanControls({
    activeTab,
    onTabChange,
    onGallery,
    onCapture,
    onFlipCamera,
    isAnalyzing,
}: ScanControlsProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8">
            {/* Tabs */}
            <div className="flex items-center justify-center gap-8 mb-8">
                <button
                    onClick={() => onTabChange("barcode")}
                    className={`flex flex-col items-center gap-2 transition-colors ${activeTab === "barcode" ? "text-white" : "text-white/50"
                        }`}
                >
                    <Barcode size={28} weight={activeTab === "barcode" ? "fill" : "regular"} />
                    <span className="text-xs font-medium uppercase tracking-wider">Code barres</span>
                </button>

                <button
                    onClick={() => onTabChange("meal")}
                    className={`flex flex-col items-center gap-2 transition-colors ${activeTab === "meal" ? "text-white" : "text-white/50"
                        }`}
                >
                    <Camera size={28} weight={activeTab === "meal" ? "fill" : "regular"} />
                    <span className="text-xs font-medium uppercase tracking-wider">Repas</span>
                </button>
            </div>

            {/* Capture button */}
            <div className="flex items-center justify-center gap-8">
                <button
                    onClick={onGallery}
                    className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                >
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
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                    </svg>
                </button>

                <button
                    onClick={onCapture}
                    disabled={isAnalyzing}
                    className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] shadow-lg shadow-[#662D91]/30"></div>
                    </div>
                </button>

                <button
                    onClick={onFlipCamera}
                    className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                >
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
                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
