import prisma from '../../config/postgres';
import { LogisticsData } from '../../../domain/entities';
import { ILogisticsRepository } from '../../../domain/repositories';

export class PrismaLogisticsRepository implements ILogisticsRepository {
  async findByImportId(importId: string): Promise<LogisticsData | null> {
    const record = await prisma.logisticsData.findUnique({
      where: { importId }
    });
    return record ? this.toDomain(record) : null;
  }

  async create(logistics: LogisticsData): Promise<LogisticsData> {
    const created = await prisma.logisticsData.create({
      data: {
        id: logistics.id,
        importId: logistics.importId,
        supplierId: logistics.supplierId,
        brokerName: logistics.brokerName,
        brokerContact: logistics.brokerContact,
        incoterm: logistics.incoterm,
        originCountry: logistics.originCountry,
        destinationCountry: logistics.destinationCountry,
        shippingMethod: logistics.shippingMethod,
        trackingNumber: logistics.trackingNumber,
        notes: logistics.notes
      }
    });
    return this.toDomain(created);
  }

  async update(logistics: LogisticsData): Promise<LogisticsData> {
    const updated = await prisma.logisticsData.update({
      where: { id: logistics.id },
      data: {
        supplierId: logistics.supplierId,
        brokerName: logistics.brokerName,
        brokerContact: logistics.brokerContact,
        incoterm: logistics.incoterm,
        originCountry: logistics.originCountry,
        destinationCountry: logistics.destinationCountry,
        shippingMethod: logistics.shippingMethod,
        trackingNumber: logistics.trackingNumber,
        notes: logistics.notes,
        updatedAt: logistics.updatedAt
      }
    });
    return this.toDomain(updated);
  }

  async deleteByImportId(importId: string): Promise<void> {
    await prisma.logisticsData.delete({ where: { importId } });
  }

  private toDomain(record: any): LogisticsData {
    return new LogisticsData(
      record.id,
      record.importId,
      record.supplierId,
      record.brokerName,
      record.brokerContact,
      record.incoterm,
      record.originCountry,
      record.destinationCountry,
      record.shippingMethod,
      record.trackingNumber,
      record.notes,
      record.createdAt,
      record.updatedAt
    );
  }
}
