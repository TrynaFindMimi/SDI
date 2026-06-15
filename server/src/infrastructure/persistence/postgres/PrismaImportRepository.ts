import prisma from '../../config/postgres';
import { Import, ImportStatus } from '../../../domain/entities';
import { IImportRepository } from '../../../domain/repositories';

export class PrismaImportRepository implements IImportRepository {
  async findAll(): Promise<Import[]> {
    const imports = await prisma.import.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return imports.map(this.toDomain);
  }

  async findById(id: string): Promise<Import | null> {
    const importRecord = await prisma.import.findUnique({ where: { id } });
    return importRecord ? this.toDomain(importRecord) : null;
  }

  async findByImportNumber(importNumber: string): Promise<Import | null> {
    const importRecord = await prisma.import.findUnique({
      where: { importNumber }
    });
    return importRecord ? this.toDomain(importRecord) : null;
  }

  async findByStatus(status: ImportStatus): Promise<Import[]> {
    const imports = await prisma.import.findMany({
      where: { status }
    });
    return imports.map(this.toDomain);
  }

  async create(importEntity: Import): Promise<Import> {
    const created = await prisma.import.create({
      data: {
        id: importEntity.id,
        importNumber: importEntity.importNumber,
        status: importEntity.status,
        startDate: importEntity.startDate,
        estimatedArrival: importEntity.estimatedArrival,
        closeDate: importEntity.closeDate,
        arrivalDate: importEntity.arrivalDate
      }
    });
    return this.toDomain(created);
  }

  async update(importEntity: Import): Promise<Import> {
    const updated = await prisma.import.update({
      where: { id: importEntity.id },
      data: {
        importNumber: importEntity.importNumber,
        status: importEntity.status,
        estimatedArrival: importEntity.estimatedArrival,
        closeDate: importEntity.closeDate,
        arrivalDate: importEntity.arrivalDate,
        updatedAt: importEntity.updatedAt
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.import.delete({ where: { id } });
  }

  private toDomain(record: any): Import {
    return new Import(
      record.id,
      record.importNumber,
      record.status as ImportStatus,
      record.startDate,
      record.estimatedArrival,
      record.closeDate,
      record.arrivalDate,
      record.createdAt,
      record.updatedAt
    );
  }
}
