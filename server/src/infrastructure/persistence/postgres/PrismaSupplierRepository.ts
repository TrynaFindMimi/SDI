import prisma from '../../config/postgres';
import { Supplier } from '../../../domain/entities';
import { ISupplierRepository } from '../../../domain/repositories';

export class PrismaSupplierRepository implements ISupplierRepository {
  async findAll(): Promise<Supplier[]> {
    const records = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    });
    return records.map(this.toDomain);
  }

  async findById(id: string): Promise<Supplier | null> {
    const record = await prisma.supplier.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByName(name: string): Promise<Supplier | null> {
    const record = await prisma.supplier.findFirst({ where: { name } });
    return record ? this.toDomain(record) : null;
  }

  async findByCountry(country: string): Promise<Supplier[]> {
    const records = await prisma.supplier.findMany({ where: { country } });
    return records.map(this.toDomain);
  }

  async create(supplier: Supplier): Promise<Supplier> {
    const created = await prisma.supplier.create({
      data: {
        id: supplier.id,
        name: supplier.name,
        country: supplier.country,
        contactName: supplier.contactName,
        contactEmail: supplier.contactEmail,
        contactPhone: supplier.contactPhone,
        address: supplier.address,
        taxId: supplier.taxId,
        isActive: supplier.isActive
      }
    });
    return this.toDomain(created);
  }

  async update(supplier: Supplier): Promise<Supplier> {
    const updated = await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        name: supplier.name,
        country: supplier.country,
        contactName: supplier.contactName,
        contactEmail: supplier.contactEmail,
        contactPhone: supplier.contactPhone,
        address: supplier.address,
        taxId: supplier.taxId,
        isActive: supplier.isActive,
        updatedAt: supplier.updatedAt
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.supplier.delete({ where: { id } });
  }

  private toDomain(record: any): Supplier {
    return new Supplier(
      record.id,
      record.name,
      record.country,
      record.contactName,
      record.contactEmail,
      record.contactPhone,
      record.address,
      record.taxId,
      record.isActive,
      record.createdAt,
      record.updatedAt
    );
  }
}
