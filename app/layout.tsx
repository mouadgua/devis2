import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FactureFlash | Devis & Factures Ultra-Rapides',
  description: 'Créez vos devis et factures en moins de 60 secondes. Interface Bento épurée, aperçu papier en direct, export PDF haute fidélité et envoi direct WhatsApp.',
  openGraph: {
    title: 'FactureFlash | Devis & Factures Ultra-Rapides',
    description: 'Créez vos devis et factures en moins de 60 secondes. Interface Bento épurée, aperçu papier en direct, export PDF haute fidélité et envoi direct WhatsApp.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FactureFlash | Devis & Factures Ultra-Rapides',
    description: 'Créez vos devis et factures en moins de 60 secondes avec aperçu papier en direct.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen bg-neutral-900 text-neutral-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-400" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
