"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Barcode, Package } from "phosphor-react";
import { ScannedProduct } from "@/lib/types/openfoodfacts";

export default function ProductPage() {
    const router = useRouter();
    const params = useParams();
    const barcode = params.barcode as string;

    const [product, setProduct] = useState<ScannedProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProduct();
    }, [barcode]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const { scanProduct } = await import("@/lib/openfoodfacts.service");
            const result = await scanProduct(barcode);

            if (result.success && result.data) {
                setProduct(result.data);
            } else {
                setError("Produit non trouvé");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    const getNutriScoreColor = (grade: string) => {
        const colors: Record<string, string> = {
            a: "bg-green-600",
            b: "bg-lime-500",
            c: "bg-yellow-500",
            d: "bg-orange-500",
            e: "bg-red-600",
        };
        return colors[grade?.toLowerCase()] || "bg-gray-400";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F7941D] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du produit...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <Package size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Produit non trouvé</h2>
                    <p className="text-gray-600 mb-6">{error || "Le produit n'a pas pu être chargé"}</p>
                    <button
                        onClick={() => router.push("/scan")}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold"
                    >
                        Scanner un autre produit
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={24} weight="bold" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 flex-1">Détails du produit</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Image et Infos Principales */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    {product.image_url && (
                        <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-full h-64 object-contain mb-4 rounded-xl"
                        />
                    )}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.product_name}</h2>
                    {product.brands && <p className="text-lg text-gray-600 mb-2">{product.brands}</p>}
                    {product.quantity && <p className="text-sm text-gray-500">{product.quantity}</p>}

                    {/* Code-barres */}
                    <div className="mt-4 flex items-center gap-2 text-gray-600">
                        <Barcode size={20} />
                        <span className="text-sm font-mono">{product.barcode}</span>
                    </div>
                </div>

                {/* Nutri-Score */}
                {product.nutriscore_grade && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Nutri-Score</h3>
                        <div className="flex items-center gap-2">
                            <div className={`${getNutriScoreColor(product.nutriscore_grade)} text-white text-2xl font-bold w-16 h-16 rounded-xl flex items-center justify-center`}>
                                {product.nutriscore_grade.toUpperCase()}
                            </div>
                            <p className="text-sm text-gray-600">
                                Qualité nutritionnelle {product.nutriscore_grade === 'a' ? 'excellente' : product.nutriscore_grade === 'b' ? 'bonne' : product.nutriscore_grade === 'c' ? 'moyenne' : product.nutriscore_grade === 'd' ? 'faible' : 'très faible'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Valeurs Nutritionnelles */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Valeurs nutritionnelles (pour 100g)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Énergie</span>
                            <span className="font-semibold">{product.nutriments.energy_kcal} kcal</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Protéines</span>
                            <span className="font-semibold">{product.nutriments.proteins} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Glucides</span>
                            <span className="font-semibold">{product.nutriments.carbohydrates} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 pl-4">
                            <span className="text-gray-600 text-sm">dont sucres</span>
                            <span className="font-semibold text-sm">{product.nutriments.sugars} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Lipides</span>
                            <span className="font-semibold">{product.nutriments.fat} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 pl-4">
                            <span className="text-gray-600 text-sm">dont acides gras saturés</span>
                            <span className="font-semibold text-sm">{product.nutriments.saturated_fat} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">Fibres</span>
                            <span className="font-semibold">{product.nutriments.fiber} g</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Sel</span>
                            <span className="font-semibold">{product.nutriments.salt} g</span>
                        </div>
                    </div>
                </div>

                {/* Ingrédients */}
                {product.ingredients_text && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Ingrédients</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{product.ingredients_text}</p>
                    </div>
                )}

                {/* Allergènes */}
                {product.allergens && (
                    <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-200">
                        <h3 className="text-lg font-bold text-amber-900 mb-3">⚠️ Allergènes</h3>
                        <p className="text-sm text-amber-800">{product.allergens}</p>
                    </div>
                )}

                {/* Bouton Scanner un autre */}
                <button
                    onClick={() => router.push("/scan")}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#F7941D] text-white font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    Scanner un autre produit
                </button>
            </div>
        </div>
    );
}
