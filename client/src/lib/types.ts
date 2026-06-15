export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface ImportFolder {
  id: string;
  folder_number: string;
  status: 'en_proceso' | 'cerrado';
  start_date: string;
  estimated_close_date: string;
  close_date?: string;
  supplier: string;
  broker: string;
  invoice_numbers: string;
  incoterm: 'FOB' | 'EXW' | 'CIF' | 'DDP';
  transport_mode: 'Marítima' | 'Aérea' | 'Terrestre';
  exchange_rate: number;
  default_margin: number;
  international_freight: number;
  international_insurance: number;
  notes: string;
  timeline_events: TimelineEvent[];
  created_date: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  status: 'pendiente' | 'completado';
}

export interface ImportProduct {
  id: string;
  folder_id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price_fob: number;
  margin_percent: number;
}

export interface ImportCost {
  id: string;
  folder_id: string;
  date: string;
  receipt_number: string;
  category: 'Financiero' | 'Permisos' | 'Transporte' | 'Seguro' | 'Aduana' | 'Logística' | 'Otros';
  description: string;
  currency: 'USD' | 'BOB';
  amount: number;
  exchange_rate: number;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contact: string;
  email: string;
  phone: string;
}

export interface ProductCatalog {
  id: string;
  code: string;
  name: string;
  category: string;
  default_unit: string;
  reference_price: number;
}

export interface ExchangeRate {
  id: string;
  date: string;
  rate: number;
  created_at: string;
  updated_at: string;
}
