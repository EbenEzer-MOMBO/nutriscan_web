"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle } from "phosphor-react";

export default function AddManualPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={24} weight="bold" className="text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Ajouter un aliment manuellement
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ED1C24] to-[#F7941D] flex items-center justify-center">
            <PlusCircle size={40} weight="bold" className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Fonctionnalité en cours de développement
          </h2>
          <p className="text-gray-600 mb-6">
            L'ajout manuel d'aliments sera bientôt disponible. En attendant, utilisez le scanner pour ajouter vos repas.
          </p>
          <button
            onClick={() => router.push("/scan")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-semibold hover:opacity-90 transition-all"
          >
            Scanner un repas
          </button>
        </div>
      </div>
    </div>
  );
}
