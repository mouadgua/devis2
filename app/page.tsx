'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_INVOICE, InvoiceData, calculateTotals, formatMoney } from '@/lib/invoice-types';
import { TopNavbar } from '@/components/TopNavbar';
import { BentoForm } from '@/components/BentoForm';
import { PaperInvoice } from '@/components/PaperInvoice';
import { ActionButtons } from '@/components/ActionButtons';
import { Sparkles, Eye } from 'lucide-react';

const STORAGE_KEY = 'factureflash_draft_data_v1';

export default function HomePage() {
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.items && parsed.client) {
            return parsed;
          }
        }
      } catch {
        // Fallback to default
      }
    }
    return INITIAL_INVOICE;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
    } catch {
      // Ignore write errors
    }
  }, [invoice]);

  const handleReset = () => {
    if (window.confirm('Voulez-vous réinitialiser le document avec les valeurs par défaut ?')) {
      setInvoice(INITIAL_INVOICE);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  };

  const handleUpdatePartial = (updated: Partial<InvoiceData>) => {
    setInvoice((prev) => ({ ...prev, ...updated }));
  };

  const totals = calculateTotals(invoice);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navbar adhering to the strict 3-zone Top Bar Contract */}
      <TopNavbar onReset={handleReset} documentType={invoice.type} />

      {/* Hero Section with refined headline and clear value proposition */}
      <section className="no-print pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Générateur Devis & Facture Express</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-400">Sans inscription</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white max-w-2xl text-balance">
              Créez votre devis ou facture en quelques secondes.
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Remplissez le formulaire minimal à gauche, observez l’aperçu papier en direct à droite, puis téléchargez votre PDF ou envoyez-le directement par WhatsApp.
            </p>
          </div>

          {/* Quick metric pill-free bar */}
          <div className="flex items-center gap-6 text-xs text-neutral-400 pt-2 md:pt-0 shrink-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 block">Total Calculé</span>
              <span className="text-lg font-bold font-mono-numbers text-white">
                {formatMoney(totals.totalTTC, invoice.currencySymbol)}
              </span>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 block">Prestations</span>
              <span className="text-lg font-bold font-mono-numbers text-neutral-200">
                {invoice.items.length} {invoice.items.length > 1 ? 'lignes' : 'ligne'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Workspace: Left Form, Right Live Paper & Action Buttons */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Minimal Bento Form (Client, Montant, Description) */}
          <div id="bento-builder" className="no-print lg:col-span-5 xl:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  1. Formulaire Minimal
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">Mise à jour instantanée</span>
            </div>

            <BentoForm invoice={invoice} onChange={setInvoice} />
          </div>

          {/* RIGHT COLUMN: Live Paper Sheet Preview + Two Big Action Buttons */}
          <div id="live-preview" className="lg:col-span-7 xl:col-span-7 space-y-6">
            
            {/* Live Preview Header */}
            <div className="no-print flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  2. Aperçu en Direct (Papier Blanc)
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono-numbers">
                Format standard A4 · Haute résolution
              </div>
            </div>

            {/* The Classical White Paper Invoice Container */}
            <div className="print-only-container relative transition-all">
              <PaperInvoice invoice={invoice} />
            </div>

            {/* TWO LARGE ACTION BUTTONS (MANDATORY REQUIREMENT) */}
            <div id="export-actions" className="no-print pt-2">
              <ActionButtons
                invoice={invoice}
                onUpdateInvoice={handleUpdatePartial}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="no-print border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-400">FactureFlash</span>
            <span>·</span>
            <span>Générateur de devis & factures avec aperçu papier et WhatsApp</span>
          </div>
          <div className="text-neutral-500">
            Conforme aux mentions légales obligatoires · Traitement 100% côté client
          </div>
        </div>
      </footer>
    </div>
  );
}
