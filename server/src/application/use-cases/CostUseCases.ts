import { ICostRepository, ICostAllocationRepository, IImportedProductRepository } from '../../domain/repositories';
import { Cost, CostAllocation, CostCategory } from '../../domain/entities';
import { CreateCostInput, UpdateCostInput } from '../dtos';

export class CostUseCases {
  constructor(
    private costRepository: ICostRepository,
    private costAllocationRepository: ICostAllocationRepository,
    private importedProductRepository: IImportedProductRepository
  ) {}

  async getByImportId(importId: string): Promise<Cost[]> {
    return this.costRepository.findByImportId(importId);
  }

  async create(importId: string, data: CreateCostInput): Promise<Cost> {
    const cost = Cost.create({
      importId,
      concept: data.concept,
      category: data.category as CostCategory,
      amount: data.amount,
      currency: data.currency || 'USD',
      description: data.description || null
    });

    return this.costRepository.create(cost);
  }

  async update(importId: string, costId: string, data: UpdateCostInput): Promise<Cost> {
    const cost = await this.costRepository.findById(costId);
    if (!cost || cost.importId !== importId) {
      throw new Error('Costo no encontrado en esta importación');
    }

    if (data.concept !== undefined) cost.concept = data.concept;
    if (data.category !== undefined) cost.category = data.category as CostCategory;
    if (data.amount !== undefined) cost.amount = data.amount;
    if (data.currency !== undefined) cost.currency = data.currency;
    if (data.description !== undefined) cost.description = data.description;

    cost.updatedAt = new Date();
    return this.costRepository.update(cost);
  }

  async remove(importId: string, costId: string): Promise<void> {
    const cost = await this.costRepository.findById(costId);
    if (!cost || cost.importId !== importId) {
      throw new Error('Costo no encontrado en esta importación');
    }

    await this.costAllocationRepository.deleteByCostId(costId);
    return this.costRepository.delete(costId);
  }

  async allocateCosts(importId: string): Promise<void> {
    const costs = await this.costRepository.findByImportId(importId);
    const products = await this.importedProductRepository.findByImportId(importId);

    if (products.length === 0) return;

    const totalFobValue = products.reduce((sum, p) => sum + p.fobValue, 0);
    if (totalFobValue === 0) return;

    for (const cost of costs) {
      await this.costAllocationRepository.deleteByCostId(cost.id);

      const allocations = products.map(product => {
        const proportion = product.fobValue / totalFobValue;
        const allocatedAmount = cost.amount * proportion;

        return CostAllocation.create({
          costId: cost.id,
          importedProductId: product.id,
          allocatedAmount,
          allocationMethod: 'proportional'
        });
      });

      await this.costAllocationRepository.createMany(allocations);
      cost.isAllocated = true;
      await this.costRepository.update(cost);
    }
  }
}
