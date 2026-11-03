'use client';

import React, { useState } from 'react';
import { InvoiceData, buildWhatsAppMessage, calculateTotals, formatMoney } from '@/lib/invoice-types';
import { Download, Printer, Copy, Check, ExternalLink, MessageCircle, AlertCircle, Share2, Sparkles } from 'lucide-react';

interface ActionButtonsProps {
  invoice: InvoiceData;
  onUpdateInvoice?: (updated: Partial<InvoiceData>) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ invoice, onUpdateInvoice }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [customPhone, setCustomPhone] = useState(invoice.client.phone || '');

  const docTitle = invoice.type === 'devis' ? 'Devis' : 'Facture';
  const totals = calculateTotals(invoice);

  // Helper to trigger direct PDF export using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      const element = document.getElementById('invoice-paper-sheet');
      if (!element) {
        throw new Error('Element not found');
      }

      // Dynamic import to avoid SSR issues
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      // High-resolution canvas capture
      const canvas = await html2canvas(element, {
        scale: 2, // 2x DPI for crisp print quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const filename = `${docTitle}_${invoice.number || '001'}.pdf`;
      pdf.save(filename);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Erreur génération PDF, recours à window.print():', err);
      // Fallback cleanly to print dialog
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Helper to open WhatsApp with pre-filled message
  const handleOpenWhatsApp = () => {
    const rawPhone = (customPhone || invoice.client.phone || '').trim();
    // Normalize phone number (strip spaces, dashes, dots)
    const cleanPhone = rawPhone.replace(/[\s\-\.\(\)]/g, '');

    const message = buildWhatsAppMessage(invoice);
    const encoded = encodeURIComponent(message);

    if (cleanPhone) {
      // If phone starts with 0 (French national format), convert to +33
      let formattedPhone = cleanPhone;
      if (formattedPhone.startsWith('0') && formattedPhone.length === 10) {
        formattedPhone = '33' + formattedPhone.slice(1);
      } else if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.slice(1);
      }

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encoded}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else {
      // If no phone number provided yet, open the quick number input modal
      setShowWhatsAppModal(true);
    }
  };

  const handleCopyMessage = async () => {
    const message = buildWhatsAppMessage(invoice);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pt-2">
      {/* TWO LARGE ACTION BUTTONS (MANDATORY PROMINENT CONTROLS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Télécharger le PDF */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 border border-neutral-700/80 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Génération du PDF...</span>
            </div>
          ) : pdfSuccess ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
              <span>PDF Téléchargé !</span>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Télécharger le PDF</div>
                <div className="text-[11px] font-normal text-neutral-400">
                  Haute résolution · A4 prêt à imprimer
                </div>
              </div>
            </>
          )}
        </button>

        {/* 2. Envoyer via WhatsApp (Stylisé aux couleurs officielles de WhatsApp) */}
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-900/30 transition-all duration-200 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shrink-0">
            {/* Authentic WhatsApp SVG Icon */}
            <svg
              className="w-5 h-5 fill-current text-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="leading-tight">Envoyer via WhatsApp</div>
            <div className="text-[11px] font-normal text-emerald-100">
              {invoice.client.phone ? `Vers ${invoice.client.phone}` : 'Message pré-rempli instantané'}
            </div>
          </div>
        </button>
      </div>

      {/* QUICK SECONDARY UTILITIES */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyMessage}
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Texte copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le texte WhatsApp</span>
              </>
            )}
          </button>

          <span className="text-neutral-600">·</span>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer direct</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Aperçu calculé en direct · {formatMoney(totals.totalTTC, invoice.currencySymbol)} TTC</span>
        </div>
      </div>

      {/* QUICK WHATSAPP MODAL IF PHONE IS MISSING */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Envoi WhatsApp</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Renseignez le numéro WhatsApp de votre client pour ouvrir directement la conversation pré-remplie :
            </p>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Numéro WhatsApp du client (avec indicatif)
              </label>
              <input
                type="tel"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500 font-mono-numbers"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Exemples : +33612345678, +32470123456, +41791234567
              </span>
            </div>

            <div className="bg-neutral-900/80 rounded-xl p-3 border border-neutral-800 text-[11px] text-neutral-400 max-h-28 overflow-y-auto font-mono whitespace-pre-wrap">
              {buildWhatsAppMessage({
                ...invoice,
                client: { ...invoice.client, phone: customPhone || invoice.client.phone },
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onUpdateInvoice && customPhone) {
                    onUpdateInvoice({
                      client: { ...invoice.client, phone: customPhone },
                    });
                  }
                  setShowWhatsAppModal(false);
                  setTimeout(() => handleOpenWhatsApp(), 100);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] rounded-xl flex items-center gap-1.5 shadow"
              >
                <span>Ouvrir WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
