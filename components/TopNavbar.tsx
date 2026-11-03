'use client';

import React from 'react';
import { Sparkles, Zap, RotateCcw } from 'lucide-react';
import { INITIAL_INVOICE, InvoiceData } from '@/lib/invoice-types';

interface TopNavbarProps {
  onReset: () => void;
  documentType: 'facture' | 'devis';
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onReset, documentType }) => {
  return (
    <header className="no-print sticky top-0 z-40 w-full bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-neutral-950 shadow-md">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            FactureFlash
          </span>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
          <a
            href="#bento-builder"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Éditeur
          </a>
          <a
            href="#live-preview"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Aperçu Papier
          </a>
          <a
            href="#export-actions"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Export & WhatsApp
          </a>
          <span className="text-neutral-700">·</span>
          <span className="text-neutral-400 whitespace-nowrap shrink-0 font-normal">
            Mode : <strong className="text-neutral-200 capitalize">{documentType}</strong>
          </span>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>
    </header>
  );
};
