'use client';

import React, { useState } from 'react';
import { InvoiceData, InvoiceItem, PRESET_TEMPLATES, DocumentType } from '@/lib/invoice-types';
import {
  FileText,
  User,
  Plus,
  Trash2,
  Building,
  ChevronDown,
  ChevronUp,
  Percent,
  Calendar,
  Sparkles,
  RefreshCw,
  CreditCard,
  Phone,
  FileCheck2,
  CheckCircle,
} from 'lucide-react';

let uniqueCounter = 1;
const generateItemId = () => {
  uniqueCounter += 1;
  return `item-${Date.now()}-${uniqueCounter}`;
};

const generateRandomDocNumber = (prefix: string) => {
  const code = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-2026-${code}`;
};

interface BentoFormProps {
  invoice: InvoiceData;
  onChange: (updated: InvoiceData) => void;
}

export const BentoForm: React.FC<BentoFormProps> = ({ invoice, onChange }) => {
  const [showIssuerDetails, setShowIssuerDetails] = useState(false);

  // Update root invoice fields
  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    onChange({ ...invoice, [key]: value });
  };

  // Update client fields
  const updateClient = (field: keyof InvoiceData['client'], value: string) => {
    onChange({
      ...invoice,
      client: { ...invoice.client, [field]: value },
    });
  };

  // Update issuer fields
  const updateIssuer = (field: keyof InvoiceData['issuer'], value: string) => {
    onChange({
      ...invoice,
      issuer: { ...invoice.issuer, [field]: value },
    });
  };

  // Item management
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoice.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) || 0 : value,
    };
    onChange({ ...invoice, items: newItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: generateItemId(),
      description: '',
      quantity: 1,
      unitPrice: 100,
    };
    onChange({ ...invoice, items: [...invoice.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    if (invoice.items.length <= 1) {
      // Keep at least one empty item
      onChange({
        ...invoice,
        items: [{ id: generateItemId(), description: '', quantity: 1, unitPrice: 0 }],
      });
      return;
    }
    const newItems = invoice.items.filter((_, idx) => idx !== index);
    onChange({ ...invoice, items: newItems });
  };

  // Document Type Switch
  const handleTypeChange = (newType: DocumentType) => {
    const prefix = newType === 'devis' ? 'DEV' : 'FAC';
    const currentNum = invoice.number.replace(/^(FAC|DEV)-/, '');
    const updatedNumber = `${prefix}-${currentNum || '2026-0001'}`;
    onChange({
      ...invoice,
      type: newType,
      number: updatedNumber,
    });
  };

  // Quick preset loader
  const handleLoadPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    const prefix = preset.type === 'devis' ? 'DEV' : 'FAC';
    onChange({
      ...invoice,
      type: preset.type,
      number: generateRandomDocNumber(prefix),
      client: {
        ...invoice.client,
        ...preset.client,
      },
      items: preset.items.map((it) => ({ ...it, id: generateItemId() })),
      vatRate: preset.vatRate,
      notes: preset.notes,
    });
  };

  // Regenerate random document number
  const handleRegenerateNumber = () => {
    const prefix = invoice.type === 'devis' ? 'DEV' : 'FAC';
    updateField('number', generateRandomDocNumber(prefix));
  };

  return (
    <div className="space-y-4">
      {/* 1. BENTO CARD: 1-CLIC PRESETS (Génération Ultra-Rapide) */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Modèles rapides 1-clic
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Pré-remplissage express</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleLoadPreset(tmpl)}
              className="text-left px-3 py-2 bg-neutral-900/80 hover:bg-neutral-700/80 border border-neutral-700 hover:border-neutral-500 rounded-xl transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-semibold text-emerald-400 group-hover:text-emerald-300">
                {tmpl.badge} · {tmpl.type.toUpperCase()}
              </div>
              <div className="text-xs font-semibold text-neutral-200 truncate mt-0.5">
                {tmpl.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. BENTO CARD: TYPE DE DOCUMENT & NUMÉROTATION */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Segmented Document Type Selector */}
          <div className="flex items-center p-1 bg-neutral-900 rounded-xl border border-neutral-700/80">
            <button
              type="button"
              onClick={() => handleTypeChange('facture')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                invoice.type === 'facture'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Facture
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('devis')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                invoice.type === 'devis'
                  ? 'bg-amber-500 text-neutral-950 font-extrabold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Devis
            </button>
          </div>

          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-neutral-400 font-medium">Statut :</label>
            <select
              value={invoice.status}
              onChange={(e) => updateField('status', e.target.value as any)}
              className="bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé</option>
              <option value="paid">Payé</option>
            </select>
          </div>
        </div>

        {/* Inputs: N°, Date & Echeance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Numéro
            </label>
            <div className="relative">
              <input
                type="text"
                value={invoice.number}
                onChange={(e) => updateField('number', e.target.value)}
                placeholder="FAC-2026-0001"
                className="w-full bg-neutral-900 border border-neutral-700/90 rounded-xl px-3 py-2 text-xs font-bold text-white font-mono-numbers focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleRegenerateNumber}
                title="Générer un nouveau numéro"
                className="absolute right-2 top-2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Date d’émission
            </label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700/90 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Date d’échéance
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700/90 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 3. BENTO CARD: CLIENT (Destinataire & Cible WhatsApp) */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Client & Destinataire
            </h2>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <Phone className="w-3 h-3" />
            Lié à WhatsApp
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Nom du Client / Entreprise <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={invoice.client.name}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder="Ex: Studio Nova SARL ou Marie Curie"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Téléphone / WhatsApp <span className="text-emerald-400 font-semibold">(pour envoi direct)</span>
            </label>
            <input
              type="tel"
              value={invoice.client.phone}
              onChange={(e) => updateClient('phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500 font-mono-numbers"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Interlocuteur (optionnel)
            </label>
            <input
              type="text"
              value={invoice.client.contactPerson || ''}
              onChange={(e) => updateClient('contactPerson', e.target.value)}
              placeholder="Ex: Marc Lefevre"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Email client
            </label>
            <input
              type="email"
              value={invoice.client.email}
              onChange={(e) => updateClient('email', e.target.value)}
              placeholder="contact@client.com"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Ville / Code Postal
            </label>
            <input
              type="text"
              value={invoice.client.city}
              onChange={(e) => updateClient('city', e.target.value)}
              placeholder="75001 Paris"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 4. BENTO CARD: PRESTATION & MONTANT (DESCRIPTION, QUANTITÉ, PRIX) */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2.5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Prestations & Montants
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter une ligne
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-neutral-900/90 border border-neutral-700/80 rounded-xl p-3 space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-neutral-400">
                  Ligne #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  title="Supprimer la ligne"
                  className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Description */}
              <div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Description détaillée de la prestation ou du produit"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Quantité & Prix Unitaire */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono-numbers focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Prix unitaire HT ({invoice.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white font-mono-numbers focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TVA & Options rapides */}
        <div className="pt-2 border-t border-neutral-700/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Taux de TVA
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '0%', value: 0 },
                { label: '5.5%', value: 5.5 },
                { label: '10%', value: 10 },
                { label: '20%', value: 20 },
              ].map((rate) => (
                <button
                  key={rate.label}
                  type="button"
                  onClick={() => updateField('vatRate', rate.value)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    invoice.vatRate === rate.value
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
            {invoice.vatRate === 0 && (
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Art. 293 B du CGI (Auto-entrepreneur)
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Devise monétaire
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { code: 'EUR', symbol: '€' },
                { code: 'USD', symbol: '$' },
                { code: 'GBP', symbol: '£' },
                { code: 'CHF', symbol: 'CHF' },
              ].map((cur) => (
                <button
                  key={cur.code}
                  type="button"
                  onClick={() => {
                    onChange({
                      ...invoice,
                      currency: cur.code,
                      currencySymbol: cur.symbol,
                    });
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    invoice.currencySymbol === cur.symbol
                      ? 'bg-neutral-100 text-neutral-900 border-white'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                >
                  {cur.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Remise & Acompte */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Remise commerciale (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={invoice.discountPercent}
              onChange={(e) => updateField('discountPercent', Number(e.target.value) || 0)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono-numbers focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Acompte déjà versé ({invoice.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              value={invoice.depositAmount}
              onChange={(e) => updateField('depositAmount', Number(e.target.value) || 0)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono-numbers focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 5. BENTO CARD: MODALITÉS & MENTIONS DE PAIEMENT */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-700/60 pb-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
            Modalités & Note au client
          </h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Conditions de règlement
          </label>
          <input
            type="text"
            value={invoice.paymentTerms}
            onChange={(e) => updateField('paymentTerms', e.target.value)}
            placeholder="Ex: Paiement à 30 jours par virement bancaire"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Remarque personnalisée / Mention légale
          </label>
          <textarea
            rows={2}
            value={invoice.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Ex: Devis valable 30 jours. Merci pour votre collaboration !"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 resize-none"
          />
        </div>
      </div>

      {/* 6. BENTO CARD: MON ENTREPRISE / ÉMETTEUR (Repliable pour garder le formulaire ultra-rapide) */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-sm space-y-3">
        <button
          type="button"
          onClick={() => setShowIssuerDetails(!showIssuerDetails)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Mon Entreprise & Logo
            </h2>
            <span className="text-[11px] text-neutral-400">({invoice.issuer.name})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-400 group-hover:text-white transition-colors">
            <span>{showIssuerDetails ? 'Masquer' : 'Modifier'}</span>
            {showIssuerDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showIssuerDetails && (
          <div className="pt-3 border-t border-neutral-700/60 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Nom de l’entreprise</label>
                <input
                  type="text"
                  value={invoice.issuer.name}
                  onChange={(e) => updateIssuer('name', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Activité / Statut</label>
                <input
                  type="text"
                  value={invoice.issuer.legalStatus}
                  onChange={(e) => updateIssuer('legalStatus', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Initiales Logo</label>
                <input
                  type="text"
                  maxLength={3}
                  value={invoice.issuer.logoText}
                  onChange={(e) => updateIssuer('logoText', e.target.value.toUpperCase())}
                  placeholder="AP"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold text-center focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">SIRET</label>
                <input
                  type="text"
                  value={invoice.issuer.siret}
                  onChange={(e) => updateIssuer('siret', e.target.value)}
                  placeholder="892 481 029 00021"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono-numbers focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Email professionnel</label>
                <input
                  type="email"
                  value={invoice.issuer.email}
                  onChange={(e) => updateIssuer('email', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Téléphone</label>
                <input
                  type="tel"
                  value={invoice.issuer.phone}
                  onChange={(e) => updateIssuer('phone', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono-numbers focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-medium">IBAN (pour virement)</label>
              <input
                type="text"
                value={invoice.issuer.iban}
                onChange={(e) => updateIssuer('iban', e.target.value)}
                placeholder="FR76 3000 4000 1234 5678 9012 345"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono-numbers focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
