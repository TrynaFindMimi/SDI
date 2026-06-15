import { Import, ImportStatus } from '../entities/Import';

export interface IImportRepository {
  findAll(): Promise<Import[]>;
  findById(id: string): Promise<Import | null>;
  findByImportNumber(importNumber: string): Promise<Import | null>;
  findByStatus(status: ImportStatus): Promise<Import[]>;
  create(importEntity: Import): Promise<Import>;
  update(importEntity: Import): Promise<Import>;
  delete(id: string): Promise<void>;
}
