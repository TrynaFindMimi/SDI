import prisma from '../../config/postgres';
import { ProductCatalog } from '../../../domain/entities';
import { IProductCatalogRepository } from '../../../domain/repositories';

export class PrismaProductCatalogRepository implements IProductCatalogRepository {
  async findAll(): Promise<ProductCatalog[]> {
    const records = await prisma.productCatalog.findMany({
      orderBy: { name: 'asc' }
    });
    return records.map(this.toDomain);
  }

  async findById(id: string): Promise<ProductCatalog | null> {
    const record = await prisma.productCatalog.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findBySku(sku: string): Promise<ProductCatalog | null> {
    const record = await prisma.productCatalog.findUnique({ where: { sku } });
    return record ? this.toDomain(record) : null;
  }

  async findByCategory(category: string): Promise<ProductCatalog[]> {
    const records = await prisma.productCatalog.findMany({ where: { category } });
    return records.map(this.toDomain);
  }

  async create(product: ProductCatalog): Promise<ProductCatalog> {
    const created = await prisma.productCatalog.create({
      data: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        description: product.description,
        referenceFobPrice: product.referenceFobPrice,
        unitOfMeasure: product.unitOfMeasure,
        isActive: product.isActive
      }
    });
    return this.toDomain(created);
  }

  async update(product: ProductCatalog): Promise<ProductCatalog> {
    const updated = await prisma.productCatalog.update({
      where: { id: product.id },
      data: {
        sku: product.sku,
        name: product.name,
        category: product.category,
        description: product.description,
        referenceFobPrice: product.referenceFobPrice,
        unitOfMeasure: product.unitOfMeasure,
        isActive: product.isActive,
        updatedAt: product.updatedAt
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.productCatalog.delete({ where: { id } });
  }

  private toDomain(record: any): ProductCatalog {
    return new ProductCatalog(
      record.id,
      record.sku,
      record.name,
      record.category,
      record.description,
      record.referenceFobPrice ? Number(record.referenceFobPrice) : null,
      record.unitOfMeasure,
      record.isActive,
      record.createdAt,
      record.updatedAt
    );
  }
}
