import { IProductCatalogRepository, IImportedProductRepository } from '../../domain/repositories';
import { ImportedProduct } from '../../domain/entities';
import { CreateProductInput, UpdateProductInput } from '../dtos';

export class ProductUseCases {
  constructor(
    private importedProductRepository: IImportedProductRepository,
    private catalogRepository: IProductCatalogRepository
  ) {}

  async getByImportId(importId: string): Promise<ImportedProduct[]> {
    return this.importedProductRepository.findByImportId(importId);
  }

  async addToImport(importId: string, data: CreateProductInput): Promise<ImportedProduct> {
    let sku = data.sku;
    let name = data.name;

    if (data.catalogProductId) {
      const catalogProduct = await this.catalogRepository.findById(data.catalogProductId);
      if (catalogProduct) {
        sku = catalogProduct.sku;
        name = catalogProduct.name;
      }
    }

    const product = ImportedProduct.create({
      importId,
      catalogProductId: data.catalogProductId || null,
      sku,
      name,
      quantity: data.quantity,
      fobPrice: data.fobPrice,
      expectedMargin: data.expectedMargin || 0,
      notes: data.notes || null
    });

    return this.importedProductRepository.create(product);
  }

  async update(importId: string, productId: string, data: UpdateProductInput): Promise<ImportedProduct> {
    const product = await this.importedProductRepository.findById(productId);
    if (!product || product.importId !== importId) {
      throw new Error('Producto no encontrado en esta importación');
    }

    if (data.quantity !== undefined) product.quantity = data.quantity;
    if (data.fobPrice !== undefined) product.fobPrice = data.fobPrice;
    if (data.expectedMargin !== undefined) product.expectedMargin = data.expectedMargin;
    if (data.notes !== undefined) product.notes = data.notes;

    product.updatedAt = new Date();
    return this.importedProductRepository.update(product);
  }

  async removeFromImport(importId: string, productId: string): Promise<void> {
    const product = await this.importedProductRepository.findById(productId);
    if (!product || product.importId !== importId) {
      throw new Error('Producto no encontrado en esta importación');
    }

    return this.importedProductRepository.delete(productId);
  }
}
