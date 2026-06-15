import { IImportRepository } from '../../domain/repositories';
import { Import, ImportStatus } from '../../domain/entities';
import { CreateImportInput, UpdateImportInput } from '../dtos';

export class ImportUseCases {
  constructor(private importRepository: IImportRepository) {}

  async getAll(): Promise<Import[]> {
    return this.importRepository.findAll();
  }

  async getById(id: string): Promise<Import | null> {
    return this.importRepository.findById(id);
  }

  async create(data: CreateImportInput): Promise<Import> {
    const existing = await this.importRepository.findByImportNumber(data.importNumber);
    if (existing) {
      throw new Error(`Ya existe una importación con número ${data.importNumber}`);
    }

    const importEntity = Import.create({
      importNumber: data.importNumber,
      startDate: new Date(),
      estimatedArrival: data.estimatedArrival ? new Date(data.estimatedArrival) : null
    } as any);

    return this.importRepository.create(importEntity);
  }

  async update(id: string, data: UpdateImportInput): Promise<Import> {
    const importEntity = await this.importRepository.findById(id);
    if (!importEntity) {
      throw new Error('Importación no encontrada');
    }

    if (importEntity.isClosed()) {
      throw new Error('No se puede modificar una importación cerrada');
    }

    if (data.importNumber) {
      const existing = await this.importRepository.findByImportNumber(data.importNumber);
      if (existing && existing.id !== id) {
        throw new Error(`Ya existe una importación con número ${data.importNumber}`);
      }
      importEntity.importNumber = data.importNumber;
    }

    if (data.estimatedArrival !== undefined) {
      importEntity.estimatedArrival = data.estimatedArrival ? new Date(data.estimatedArrival) : null;
    }

    importEntity.updatedAt = new Date();
    return this.importRepository.update(importEntity);
  }

  async updateStatus(id: string, status: ImportStatus): Promise<Import> {
    const importEntity = await this.importRepository.findById(id);
    if (!importEntity) {
      throw new Error('Importación no encontrada');
    }

    importEntity.updateStatus(status);
    return this.importRepository.update(importEntity);
  }

  async delete(id: string): Promise<void> {
    const importEntity = await this.importRepository.findById(id);
    if (!importEntity) {
      throw new Error('Importación no encontrada');
    }

    if (importEntity.isClosed()) {
      throw new Error('No se puede eliminar una importación cerrada');
    }

    return this.importRepository.delete(id);
  }
}
