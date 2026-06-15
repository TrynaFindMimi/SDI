import { IImportRepository, ICostRepository, IImportedProductRepository, ICostAllocationRepository } from '../../domain/repositories';

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

interface ProductFinancialSummary {
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

export class FinancialUseCases {
  constructor(
    private importRepository: IImportRepository,
    private costRepository: ICostRepository,
    private importedProductRepository: IImportedProductRepository,
    private costAllocationRepository: ICostAllocationRepository
  ) {}

  async getSummary(importId: string): Promise<FinancialSummary> {
    const importEntity = await this.importRepository.findById(importId);
    if (!importEntity) {
      throw new Error('Importación no encontrada');
    }

    const products = await this.importedProductRepository.findByImportId(importId);
    const costs = await this.costRepository.findByImportId(importId);

    const totalFobValue = products.reduce((sum, p) => sum + p.fobValue, 0);
    const totalLogisticsCosts = costs.reduce((sum, c) => sum + c.amount, 0);
    const totalLandedCost = totalFobValue + totalLogisticsCosts;

    const costBreakdown: Record<string, number> = {};
    for (const cost of costs) {
      costBreakdown[cost.category] = (costBreakdown[cost.category] || 0) + cost.amount;
    }

    const productBreakdown: ProductFinancialSummary[] = [];
    for (const product of products) {
      const allocations = await this.costAllocationRepository.findByProductId(product.id);
      const allocatedCosts = allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
      const totalCost = product.fobValue + allocatedCosts;
      const unitCost = product.quantity > 0 ? totalCost / product.quantity : 0;
      const expectedRevenue = product.expectedRevenue;
      const expectedProfit = expectedRevenue - totalCost;
      const roi = totalCost > 0 ? (expectedProfit / totalCost) * 100 : 0;

      productBreakdown.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        fobValue: product.fobValue,
        allocatedCosts,
        totalCost,
        unitCost,
        expectedRevenue,
        expectedProfit,
        roi
      });
    }

    const totalExpectedRevenue = productBreakdown.reduce((sum, p) => sum + p.expectedRevenue, 0);
    const totalExpectedProfit = totalExpectedRevenue - totalLandedCost;
    const averageROI = totalLandedCost > 0 ? (totalExpectedProfit / totalLandedCost) * 100 : 0;
    const profitMargin = totalExpectedRevenue > 0 ? (totalExpectedProfit / totalExpectedRevenue) * 100 : 0;

    return {
      importId,
      totalFobValue,
      totalLogisticsCosts,
      totalLandedCost,
      costBreakdown,
      productBreakdown,
      summary: {
        totalInvestment: totalLandedCost,
        totalExpectedRevenue,
        totalExpectedProfit,
        averageROI,
        profitMargin
      }
    };
  }
}
