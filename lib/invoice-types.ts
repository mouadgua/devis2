export type DocumentType = 'facture' | 'devis';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface IssuerInfo {
  name: string;
  legalStatus: string; // e.g. SASU, Micro-entreprise
  email: string;
  phone: string;
  address: string;
  city: string;
  siret: string;
  iban: string;
  bic: string;
  logoText: string;
  logoColor: string;
}

export interface ClientInfo {
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  sirenOrVat?: string;
}

export interface InvoiceData {
  type: DocumentType;
  number: string;
  date: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  vatRate: number; // e.g. 20, 10, 5.5, 0
  discountPercent: number;
  depositAmount: number;
  paymentTerms: string;
  notes: string;
  status: 'draft' | 'sent' | 'paid';
  issuer: IssuerInfo;
  client: ClientInfo;
  items: InvoiceItem[];
}

export const PRESET_TEMPLATES = [
  {
    name: 'Création Site Web',
    badge: 'Digital',
    type: 'facture' as DocumentType,
    client: {
      name: 'Studio Nova SARL',
      contactPerson: 'Marc Lefevre',
      email: 'contact@studionova.fr',
      phone: '+33612345678',
      address: '14 rue de la République',
      city: '69002 Lyon',
      sirenOrVat: 'FR 84 923847291',
    },
    items: [
      { id: '1', description: 'Conception UI/UX & Maquettes interactives Figma', quantity: 1, unitPrice: 750 },
      { id: '2', description: 'Développement Next.js, Tailwind CSS & Intégration responsive', quantity: 1, unitPrice: 1600 },
      { id: '3', description: 'Optimisation SEO technique, performances & mise en ligne', quantity: 1, unitPrice: 350 },
    ],
    vatRate: 20,
    notes: 'Livraison clé en main sous 3 semaines. Hébergement inclus pendant 1 an.',
  },
  {
    name: 'Consulting & Conseil',
    badge: 'Stratégie',
    type: 'devis' as DocumentType,
    client: {
      name: 'Apex Horizon SAS',
      contactPerson: 'Claire Danvers',
      email: 'c.danvers@apexhorizon.com',
      phone: '+33698765432',
      address: '42 Avenue Montaigne',
      city: '75008 Paris',
      sirenOrVat: 'FR 55 489201948',
    },
    items: [
      { id: '1', description: 'Audit stratégique des processus opérationnels (2 jours)', quantity: 2, unitPrice: 850 },
      { id: '2', description: 'Restitution d’analyse et feuille de route Q3-Q4', quantity: 1, unitPrice: 600 },
    ],
    vatRate: 20,
    notes: 'Devis valable 30 jours à compter de sa date d’émission. Acompte de 30% à la commande.',
  },
  {
    name: 'Design & Branding',
    badge: 'Créatif',
    type: 'facture' as DocumentType,
    client: {
      name: 'Café Belleville',
      contactPerson: 'Julien Mercier',
      email: 'julien@cafebelleville.paris',
      phone: '+33711223344',
      address: '28 Rue Sainte-Marthe',
      city: '75010 Paris',
      sirenOrVat: 'FR 21 893452109',
    },
    items: [
      { id: '1', description: 'Création logotype complet, déclinaisons & charte graphique', quantity: 1, unitPrice: 890 },
      { id: '2', description: 'Supports de communication print (cartes, menus, stickers)', quantity: 1, unitPrice: 420 },
    ],
    vatRate: 0,
    notes: 'TVA non applicable, art. 293 B du CGI. Cession des droits d’auteur incluse.',
  },
  {
    name: 'Dépannage & Travaux',
    badge: 'Services',
    type: 'devis' as DocumentType,
    client: {
      name: 'SCI Beauregard',
      contactPerson: 'Thomas Dubois',
      email: 'contact@scibeauregard.fr',
      phone: '+33655443322',
      address: '5 Impasse des Pins',
      city: '33000 Bordeaux',
      sirenOrVat: '',
    },
    items: [
      { id: '1', description: 'Diagnostic technique & intervention de remise en conformité', quantity: 1, unitPrice: 280 },
      { id: '2', description: 'Fourniture et remplacement composants haute sécurité', quantity: 1, unitPrice: 410 },
      { id: '3', description: 'Main d’œuvre qualifiée (forfait 3h)', quantity: 3, unitPrice: 65 },
    ],
    vatRate: 10,
    notes: 'Garantie décennale. Matériel garanti 2 ans par le constructeur.',
  },
];

export const INITIAL_INVOICE: InvoiceData = {
  type: 'facture',
  number: 'FAC-2026-0042',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'EUR',
  currencySymbol: '€',
  vatRate: 20,
  discountPercent: 0,
  depositAmount: 0,
  paymentTerms: 'Paiement à 30 jours par virement bancaire',
  notes: 'Merci pour votre confiance ! Pour tout renseignement, n’hésitez pas à nous contacter.',
  status: 'draft',
  issuer: {
    name: 'Atelier Pulse',
    legalStatus: 'Freelance & Conseil Digital',
    email: 'contact@atelierpulse.fr',
    phone: '+33 6 12 34 56 78',
    address: '8 passage Saint-Sébastien',
    city: '75011 Paris',
    siret: '892 481 029 00021',
    iban: 'FR76 3000 4000 1234 5678 9012 345',
    bic: 'BNPAFRPPXXX',
    logoText: 'AP',
    logoColor: '#0f172a',
  },
  client: {
    name: 'Studio Nova SARL',
    contactPerson: 'Marc Lefevre',
    email: 'contact@studionova.fr',
    phone: '+33612345678',
    address: '14 rue de la République',
    city: '69002 Lyon',
    sirenOrVat: 'FR 84 923847291',
  },
  items: [
    {
      id: 'item-1',
      description: 'Conception UI/UX & Maquettes interactives Figma',
      quantity: 1,
      unitPrice: 750,
    },
    {
      id: 'item-2',
      description: 'Développement Next.js & Tailwind CSS responsive',
      quantity: 1,
      unitPrice: 1600,
    },
    {
      id: 'item-3',
      description: 'Optimisation performances, SEO & Déploiement',
      quantity: 1,
      unitPrice: 350,
    },
  ],
};

export function calculateTotals(invoice: InvoiceData) {
  const subtotalHT = invoice.items.reduce((acc, item) => {
    const q = Number(item.quantity) || 0;
    const p = Number(item.unitPrice) || 0;
    return acc + q * p;
  }, 0);

  const discountAmount = (subtotalHT * (Number(invoice.discountPercent) || 0)) / 100;
  const netHT = Math.max(0, subtotalHT - discountAmount);
  const vatAmount = (netHT * (Number(invoice.vatRate) || 0)) / 100;
  const totalTTC = netHT + vatAmount;
  const balanceDue = Math.max(0, totalTTC - (Number(invoice.depositAmount) || 0));

  return {
    subtotalHT,
    discountAmount,
    netHT,
    vatAmount,
    totalTTC,
    balanceDue,
  };
}

export function formatMoney(amount: number, symbol = '€'): string {
  return `${amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${symbol}`;
}

export function buildWhatsAppMessage(invoice: InvoiceData): string {
  const totals = calculateTotals(invoice);
  const docTypeLabel = invoice.type === 'devis' ? 'Devis' : 'Facture';
  const clientName = invoice.client.contactPerson || invoice.client.name || 'Bonjour';

  let itemsSummary = '';
  invoice.items.forEach((item) => {
    if (item.description) {
      itemsSummary += `• ${item.description} (${item.quantity}x ${formatMoney(item.unitPrice, invoice.currencySymbol)})\n`;
    }
  });

  const message = `Bonjour ${clientName},\n\n` +
    `Voici le récapitulatif de votre *${docTypeLabel} N° ${invoice.number}* du ${new Date(invoice.date).toLocaleDateString('fr-FR')} :\n\n` +
    (itemsSummary ? `*Détail des prestations :*\n${itemsSummary}\n` : '') +
    `*Montant Total :* ${formatMoney(totals.totalTTC, invoice.currencySymbol)} TTC` +
    (invoice.vatRate === 0 ? ' (TVA non applicable, art. 293 B du CGI)' : ` (dont TVA ${invoice.vatRate}%: ${formatMoney(totals.vatAmount, invoice.currencySymbol)})`) +
    `\n\n` +
    `Date d'échéance : ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}\n` +
    (invoice.issuer.iban ? `IBAN : ${invoice.issuer.iban}\n` : '') +
    `\nRestant à votre entière disposition pour tout renseignement.\n` +
    `Bien cordialement,\n*${invoice.issuer.name}*`;

  return message;
}
