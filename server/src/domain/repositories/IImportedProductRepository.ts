import { ImportedProduct } from '../entities/ImportedProduct';

export interface IImportedProductRepository {
  findByImportId(importId: string): Promise<ImportedProduct[]>;
  findById(id: string): Promise<ImportedProduct | null>;
  create(product: ImportedProduct): Promise<ImportedProduct>;
  update(product: ImportedProduct): Promise<ImportedProduct>;
  delete(id: string): Promise<void>;
  deleteByImportId(importId: string): Promise<void>;
}
