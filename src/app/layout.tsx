import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SALIB — Réservation de salles",
  description: "Trouvez et réservez l’espace adapté à votre prochain projet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
