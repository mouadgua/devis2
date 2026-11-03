'use client';

import React from 'react';
import { InvoiceData, calculateTotals, formatMoney } from '@/lib/invoice-types';
import { Building2, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';

interface PaperInvoiceProps {
  invoice: InvoiceData;
  id?: string;
}

export const PaperInvoice: React.FC<PaperInvoiceProps> = ({ invoice, id = 'invoice-paper-sheet' }) => {
  const totals = calculateTotals(invoice);
  const isDevis = invoice.type === 'devis';

  return (
    <div
      id={id}
      className="invoice-paper-sheet relative w-full bg-white text-neutral-900 rounded-xl shadow-2xl border border-neutral-200/90 p-8 sm:p-10 md:p-12 transition-all"
      style={{ minHeight: '842px' }}
    >
      {/* Paper Top Decorative Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-900 rounded-t-xl" />

      {/* Header Section: Logo & Document Reference */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-neutral-200">
        {/* Logo & Company Name */}
        <div className="flex items-center gap-4">
          <div
            className="w-13 h-13 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md shrink-0"
            style={{ backgroundColor: invoice.issuer.logoColor || '#0f172a' }}
          >
            {invoice.issuer.logoText || 'AP'}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              {invoice.issuer.name || 'Nom de l’entreprise'}
            </h1>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              {invoice.issuer.legalStatus || 'Professionnel indépendant'}
            </p>
          </div>
        </div>

        {/* Document Title & Reference Tag */}
        <div className="text-left sm:text-right">
          <div className="flex items-center sm:justify-end gap-2">
            <span className={`inline-flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
              isDevis 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-neutral-900 text-white'
            }`}>
              {isDevis ? 'DEVIS' : 'FACTURE'}
            </span>
            {invoice.status === 'paid' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Payée
              </span>
            )}
            {invoice.status === 'draft' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-neutral-400" />
                Brouillon
              </span>
            )}
          </div>
          <div className="text-base font-bold font-mono-numbers text-neutral-900 mt-1">
            N° {invoice.number || (isDevis ? 'DEV-2026-0001' : 'FAC-2026-0001')}
          </div>
          <div className="text-xs text-neutral-500 mt-1 flex flex-col sm:items-end gap-0.5">
            <span>Date d’émission : <strong className="text-neutral-700 font-mono-numbers">{invoice.date ? new Date(invoice.date).toLocaleDateString('fr-FR') : '-'}</strong></span>
            <span>Date d’échéance : <strong className="text-neutral-700 font-mono-numbers">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : '-'}</strong></span>
          </div>
        </div>
      </div>

      {/* Issuer & Client Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-7 border-b border-neutral-100 text-xs">
        {/* Émetteur */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Émetteur
          </span>
          <div className="space-y-1 text-neutral-700">
            <p className="font-semibold text-neutral-900 text-sm">{invoice.issuer.name}</p>
            <p>{invoice.issuer.address}</p>
            <p>{invoice.issuer.city}</p>
            {invoice.issuer.siret && (
              <p className="text-neutral-500 pt-1">
                SIRET : <span className="font-mono-numbers">{invoice.issuer.siret}</span>
              </p>
            )}
            <p className="text-neutral-500">{invoice.issuer.email} · {invoice.issuer.phone}</p>
          </div>
        </div>

        {/* Client */}
        <div className="sm:border-l sm:border-neutral-100 sm:pl-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            {isDevis ? 'Destinataire du Devis' : 'Facturé à'}
          </span>
          <div className="space-y-1 text-neutral-700">
            <p className="font-semibold text-neutral-900 text-sm">
              {invoice.client.name || 'Nom du Client ou Entreprise'}
            </p>
            {invoice.client.contactPerson && (
              <p className="text-neutral-600">Attn: {invoice.client.contactPerson}</p>
            )}
            <p>{invoice.client.address || 'Adresse du client'}</p>
            <p>{invoice.client.city || 'Code postal & Ville'}</p>
            {invoice.client.phone && (
              <p className="text-neutral-600 font-mono-numbers">Tél : {invoice.client.phone}</p>
            )}
            {invoice.client.email && (
              <p className="text-neutral-500">{invoice.client.email}</p>
            )}
            {invoice.client.sirenOrVat && (
              <p className="text-neutral-500 pt-0.5">
                N° TVA : <span className="font-mono-numbers">{invoice.client.sirenOrVat}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="py-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              <th className="py-3 pr-4 font-semibold">Description de la prestation</th>
              <th className="py-3 px-3 text-center font-semibold w-16">Qté</th>
              <th className="py-3 px-3 text-right font-semibold w-28">Prix unit. HT</th>
              <th className="py-3 pl-3 text-right font-semibold w-28">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs">
            {invoice.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400 italic">
                  Aucune ligne d’article. Ajoutez vos prestations dans le formulaire.
                </td>
              </tr>
            ) : (
              invoice.items.map((item, idx) => {
                const totalItem = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                return (
                  <tr key={item.id || idx} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 pr-4 align-top">
                      <div className="font-medium text-neutral-900 leading-snug">
                        {item.description || 'Prestation sans description'}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center align-top font-mono-numbers text-neutral-700">
                      {item.quantity || 1}
                    </td>
                    <td className="py-3.5 px-3 text-right align-top font-mono-numbers text-neutral-700">
                      {formatMoney(Number(item.unitPrice) || 0, invoice.currencySymbol)}
                    </td>
                    <td className="py-3.5 pl-3 text-right align-top font-mono-numbers font-semibold text-neutral-900">
                      {formatMoney(totalItem, invoice.currencySymbol)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Totals & Financial Calculation Section */}
      <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start gap-6">
        {/* Payment Terms & Notes */}
        <div className="w-full sm:w-1/2 space-y-3 text-xs text-neutral-600">
          <div>
            <span className="font-semibold text-neutral-900 block mb-0.5">Modalités de règlement :</span>
            <p className="text-neutral-600 leading-relaxed">{invoice.paymentTerms}</p>
          </div>
          {invoice.notes && (
            <div>
              <span className="font-semibold text-neutral-900 block mb-0.5">Note & Remarques :</span>
              <p className="text-neutral-500 leading-relaxed italic">{invoice.notes}</p>
            </div>
          )}
          {invoice.issuer.iban && (
            <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200/80 font-mono-numbers text-[11px] text-neutral-700">
              <span className="font-bold text-neutral-900 block text-[10px] uppercase tracking-wider mb-1">
                Coordonnées bancaires pour virement
              </span>
              <p>IBAN : {invoice.issuer.iban}</p>
              {invoice.issuer.bic && <p>BIC : {invoice.issuer.bic}</p>}
            </div>
          )}
        </div>

        {/* Calculation Table */}
        <div className="w-full sm:w-2/5 space-y-2 text-xs">
          <div className="flex justify-between py-1 text-neutral-600">
            <span>Total HT :</span>
            <span className="font-mono-numbers font-medium text-neutral-900">
              {formatMoney(totals.subtotalHT, invoice.currencySymbol)}
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between py-1 text-emerald-700">
              <span>Remise ({invoice.discountPercent}%) :</span>
              <span className="font-mono-numbers font-medium">
                - {formatMoney(totals.discountAmount, invoice.currencySymbol)}
              </span>
            </div>
          )}

          <div className="flex justify-between py-1 text-neutral-600">
            <span>
              TVA ({invoice.vatRate}%)
              {invoice.vatRate === 0 && <span className="text-[10px] text-neutral-400 block">(Exonéré art. 293 B)</span>} :
            </span>
            <span className="font-mono-numbers font-medium text-neutral-900">
              {formatMoney(totals.vatAmount, invoice.currencySymbol)}
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-300 flex justify-between items-baseline">
            <span className="text-sm font-bold text-neutral-900 uppercase">
              {isDevis ? 'Total TTC Devis' : 'Total TTC à payer'} :
            </span>
            <span className="text-xl font-extrabold font-mono-numbers text-neutral-900 tracking-tight">
              {formatMoney(totals.totalTTC, invoice.currencySymbol)}
            </span>
          </div>

          {invoice.depositAmount > 0 && (
            <>
              <div className="flex justify-between py-1 text-neutral-500 text-[11px]">
                <span>Acompte déjà versé :</span>
                <span className="font-mono-numbers">
                  - {formatMoney(invoice.depositAmount, invoice.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between py-1 font-bold text-neutral-900 border-t border-neutral-200">
                <span>Solde restant dû :</span>
                <span className="font-mono-numbers text-emerald-600">
                  {formatMoney(totals.balanceDue, invoice.currencySymbol)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Classical Signature / Approval Block */}
      <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-8 text-[11px] text-neutral-500">
        <div>
          <p className="font-semibold text-neutral-700 mb-1">Pour l’émetteur :</p>
          <p className="text-neutral-400 italic">Bon pour accord et émission</p>
          <div className="mt-3 text-neutral-800 font-medium">{invoice.issuer.name}</div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-neutral-700 mb-1">
            {isDevis ? 'Pour le client (Date, Signature & "Bon pour accord") :' : 'Signature du client :'}
          </p>
          <div className="h-12 border-b border-dashed border-neutral-300 mt-2" />
        </div>
      </div>

      {/* Footer Legal Mentions */}
      <div className="mt-8 pt-4 border-t border-neutral-100 text-center text-[10px] text-neutral-400 space-y-0.5">
        <p>
          {invoice.issuer.name} · {invoice.issuer.legalStatus} · SIRET : {invoice.issuer.siret || 'En cours d’immatriculation'}
        </p>
        <p>
          En cas de retard de paiement, une indemnité forfaitaire de 40 € pour frais de recouvrement sera due (Art. D. 441-5 du C. com).
        </p>
      </div>
    </div>
  );
};
