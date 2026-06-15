export enum ImportStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  ARRIVED = 'arrived',
  CLOSED = 'closed'
}

export interface Import {
  id: string;
  importNumber: string;
  status: ImportStatus;
  startDate: string;
  estimatedArrival: string | null;
  closeDate: string | null;
  arrivalDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LogisticsData {
  id: string;
  importId: string;
  supplierId: string | null;
  brokerName: string | null;
  brokerContact: string | null;
  incoterm: string;
  originCountry: string | null;
  destinationCountry: string;
  shippingMethod: string | null;
  trackingNumber: string | null;
  notes: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  taxId: string | null;
  isActive: boolean;
}

export interface ProductCatalog {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  description: string | null;
  referenceFobPrice: number | null;
  unitOfMeasure: string;
  isActive: boolean;
}

export interface ImportedProduct {
  id: string;
  importId: string;
  catalogProductId: string | null;
  sku: string;
  name: string;
  quantity: number;
  fobPrice: number;
  expectedMargin: number;
  notes: string | null;
}

export interface Cost {
  id: string;
  importId: string;
  concept: string;
  category: string;
  amount: number;
  currency: string;
  description: string | null;
  isAllocated: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string | null;
}

export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  OPERATOR = 'operator',
  READER = 'reader'
}

export interface FinancialSummary {
  importId: string;
  totalFobValue: number;
  totalLogisticsCosts: number;
  totalLandedCost: number;
  costBreakdown: Record<string, number>;
  productBreakdown: ProductFinancialSummary[];
  summary: {
    totalInvestment: number;
    totalExpectedRevenue: number;
    totalExpectedProfit: number;
    averageROI: number;
    profitMargin: number;
  };
}

export interface ProductFinancialSummary {
  productId: string;
  sku: string;
  name: string;
  fobValue: number;
  allocatedCosts: number;
  totalCost: number;
  unitCost: number;
  expectedRevenue: number;
  expectedProfit: number;
  roi: number;
}

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
