import { IProductCatalogRepository } from '../../domain/repositories';
import { ProductCatalog } from '../../domain/entities';
import { CreateCatalogProductInput, UpdateCatalogProductInput } from '../dtos';

export class CatalogUseCases {
  constructor(private catalogRepository: IProductCatalogRepository) {}

  async getAll(): Promise<ProductCatalog[]> {
    return this.catalogRepository.findAll();
  }

  async getById(id: string): Promise<ProductCatalog | null> {
    return this.catalogRepository.findById(id);
  }

  async create(data: CreateCatalogProductInput): Promise<ProductCatalog> {
    const existing = await this.catalogRepository.findBySku(data.sku);
    if (existing) {
      throw new Error(`Ya existe un producto con SKU ${data.sku}`);
    }

    const product = ProductCatalog.create(data);
    return this.catalogRepository.create(product);
  }

  async update(id: string, data: UpdateCatalogProductInput): Promise<ProductCatalog> {
    const product = await this.catalogRepository.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (data.sku) {
      const existing = await this.catalogRepository.findBySku(data.sku);
      if (existing && existing.id !== id) {
        throw new Error(`Ya existe un producto con SKU ${data.sku}`);
      }
      product.sku = data.sku;
    }

    if (data.name !== undefined) product.name = data.name;
    if (data.category !== undefined) product.category = data.category;
    if (data.description !== undefined) product.description = data.description;
    if (data.referenceFobPrice !== undefined) product.referenceFobPrice = data.referenceFobPrice;
    if (data.unitOfMeasure !== undefined) product.unitOfMeasure = data.unitOfMeasure;
    if (data.isActive !== undefined) product.isActive = data.isActive;

    product.updatedAt = new Date();
    return this.catalogRepository.update(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.catalogRepository.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return this.catalogRepository.delete(id);
  }
}
