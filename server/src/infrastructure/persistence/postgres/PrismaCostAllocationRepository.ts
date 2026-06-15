import prisma from '../../config/postgres';
import { CostAllocation } from '../../../domain/entities';
import { ICostAllocationRepository } from '../../../domain/repositories';

export class PrismaCostAllocationRepository implements ICostAllocationRepository {
  async findByCostId(costId: string): Promise<CostAllocation[]> {
    const records = await prisma.costAllocation.findMany({
      where: { costId }
    });
    return records.map(this.toDomain);
  }

  async findByProductId(productId: string): Promise<CostAllocation[]> {
    const records = await prisma.costAllocation.findMany({
      where: { importedProductId: productId }
    });
    return records.map(this.toDomain);
  }

  async create(allocation: CostAllocation): Promise<CostAllocation> {
    const created = await prisma.costAllocation.create({
      data: {
        id: allocation.id,
        costId: allocation.costId,
        importedProductId: allocation.importedProductId,
        allocatedAmount: allocation.allocatedAmount,
        allocationMethod: allocation.allocationMethod
      }
    });
    return this.toDomain(created);
  }

  async createMany(allocations: CostAllocation[]): Promise<CostAllocation[]> {
    await prisma.costAllocation.createMany({
      data: allocations.map(a => ({
        id: a.id,
        costId: a.costId,
        importedProductId: a.importedProductId,
        allocatedAmount: a.allocatedAmount,
        allocationMethod: a.allocationMethod
      }))
    });
    return allocations;
  }

  async deleteByCostId(costId: string): Promise<void> {
    await prisma.costAllocation.deleteMany({ where: { costId } });
  }

  private toDomain(record: any): CostAllocation {
    return new CostAllocation(
      record.id,
      record.costId,
      record.importedProductId,
      Number(record.allocatedAmount),
      record.allocationMethod,
      record.createdAt
    );
  }
}
