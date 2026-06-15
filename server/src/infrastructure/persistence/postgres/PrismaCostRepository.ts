import prisma from '../../config/postgres';
import { Cost, CostCategory } from '../../../domain/entities';
import { ICostRepository } from '../../../domain/repositories';

export class PrismaCostRepository implements ICostRepository {
  async findByImportId(importId: string): Promise<Cost[]> {
    const records = await prisma.cost.findMany({
      where: { importId },
      orderBy: { createdAt: 'asc' }
    });
    return records.map(this.toDomain);
  }

  async findById(id: string): Promise<Cost | null> {
    const record = await prisma.cost.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByCategory(importId: string, category: string): Promise<Cost[]> {
    const records = await prisma.cost.findMany({
      where: { importId, category }
    });
    return records.map(this.toDomain);
  }

  async create(cost: Cost): Promise<Cost> {
    const created = await prisma.cost.create({
      data: {
        id: cost.id,
        importId: cost.importId,
        concept: cost.concept,
        category: cost.category,
        amount: cost.amount,
        currency: cost.currency,
        description: cost.description,
        isAllocated: cost.isAllocated
      }
    });
    return this.toDomain(created);
  }

  async update(cost: Cost): Promise<Cost> {
    const updated = await prisma.cost.update({
      where: { id: cost.id },
      data: {
        concept: cost.concept,
        category: cost.category,
        amount: cost.amount,
        currency: cost.currency,
        description: cost.description,
        isAllocated: cost.isAllocated,
        updatedAt: cost.updatedAt
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.cost.delete({ where: { id } });
  }

  async deleteByImportId(importId: string): Promise<void> {
    await prisma.cost.deleteMany({ where: { importId } });
  }

  private toDomain(record: any): Cost {
    return new Cost(
      record.id,
      record.importId,
      record.concept,
      record.category as CostCategory,
      Number(record.amount),
      record.currency,
      record.description,
      record.isAllocated,
      record.createdAt,
      record.updatedAt
    );
  }
}
