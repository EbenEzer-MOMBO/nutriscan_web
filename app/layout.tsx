import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPWA from "@/components/InstallPWA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nutriscan - Suivez vos calories avec l'IA",
  description: "Scannez vos repas et suivez vos calories instantanément grâce à l'intelligence artificielle. Atteignez vos objectifs nutritionnels facilement.",
  keywords: ["nutrition", "calories", "IA", "santé", "fitness", "alimentation"],
  authors: [{ name: "Nutriscan" }],
  manifest: "/manifest.json",
  themeColor: "#ED1C24",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nutriscan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <InstallPWA />
      </body>
    </html>
  );
}
