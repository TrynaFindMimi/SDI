import { Cost } from '../entities/Cost';

export interface ICostRepository {
  findByImportId(importId: string): Promise<Cost[]>;
  findById(id: string): Promise<Cost | null>;
  findByCategory(importId: string, category: string): Promise<Cost[]>;
  create(cost: Cost): Promise<Cost>;
  update(cost: Cost): Promise<Cost>;
  delete(id: string): Promise<void>;
  deleteByImportId(importId: string): Promise<void>;
}
