import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Yo! Voiz — Services entre voisins à Abidjan | Ménage, Bricolage, Livraison",
  description: "Trouvez un voisin de confiance pour le ménage, le bricolage, la livraison et plus à Abidjan. Paiement Mobile Money sécurisé. Profils vérifiés. Plus de 200 prestataires disponibles.",
  keywords: "services, Abidjan, Côte d'Ivoire, ménage, bricolage, livraison, prestataire, voisin, mobile money, Orange Money, MTN, Wave",
  authors: [{ name: "Yo! Voiz" }],
  creator: "Yo! Voiz",
  publisher: "Yo! Voiz",
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://yovoiz.ci",
    siteName: "Yo! Voiz",
    title: "Yo! Voiz — Services entre voisins à Abidjan",
    description: "Trouvez un voisin de confiance pour tous vos services du quotidien à Abidjan.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yo! Voiz - Services entre voisins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yo! Voiz — Services entre voisins à Abidjan",
    description: "Trouvez un voisin de confiance pour tous vos services du quotidien à Abidjan.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#1B7A3D" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
