import prisma from '../../config/postgres';
import { ImportedProduct } from '../../../domain/entities';
import { IImportedProductRepository } from '../../../domain/repositories';

export class PrismaImportedProductRepository implements IImportedProductRepository {
  async findByImportId(importId: string): Promise<ImportedProduct[]> {
    const records = await prisma.importedProduct.findMany({
      where: { importId },
      orderBy: { createdAt: 'asc' }
    });
    return records.map(this.toDomain);
  }

  async findById(id: string): Promise<ImportedProduct | null> {
    const record = await prisma.importedProduct.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async create(product: ImportedProduct): Promise<ImportedProduct> {
    const created = await prisma.importedProduct.create({
      data: {
        id: product.id,
        importId: product.importId,
        catalogProductId: product.catalogProductId,
        sku: product.sku,
        name: product.name,
        quantity: product.quantity,
        fobPrice: product.fobPrice,
        expectedMargin: product.expectedMargin,
        notes: product.notes
      }
    });
    return this.toDomain(created);
  }

  async update(product: ImportedProduct): Promise<ImportedProduct> {
    const updated = await prisma.importedProduct.update({
      where: { id: product.id },
      data: {
        quantity: product.quantity,
        fobPrice: product.fobPrice,
        expectedMargin: product.expectedMargin,
        notes: product.notes,
        updatedAt: product.updatedAt
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.importedProduct.delete({ where: { id } });
  }

  async deleteByImportId(importId: string): Promise<void> {
    await prisma.importedProduct.deleteMany({ where: { importId } });
  }

  private toDomain(record: any): ImportedProduct {
    return new ImportedProduct(
      record.id,
      record.importId,
      record.catalogProductId,
      record.sku,
      record.name,
      record.quantity,
      Number(record.fobPrice),
      Number(record.expectedMargin),
      record.notes,
      record.createdAt,
      record.updatedAt
    );
  }
}
