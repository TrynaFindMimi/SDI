import { ProductCatalog } from '../entities/ProductCatalog';

export interface IProductCatalogRepository {
  findAll(): Promise<ProductCatalog[]>;
  findById(id: string): Promise<ProductCatalog | null>;
  findBySku(sku: string): Promise<ProductCatalog | null>;
  findByCategory(category: string): Promise<ProductCatalog[]>;
  create(product: ProductCatalog): Promise<ProductCatalog>;
  update(product: ProductCatalog): Promise<ProductCatalog>;
  delete(id: string): Promise<void>;
}
