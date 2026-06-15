export class ProductCatalog {
  constructor(
    public readonly id: string,
    public sku: string,
    public name: string,
    public category: string | null,
    public description: string | null,
    public referenceFobPrice: number | null,
    public unitOfMeasure: string,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<ProductCatalog, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    isActive?: boolean;
  }): ProductCatalog {
    const now = new Date();
    return new ProductCatalog(
      data.id || crypto.randomUUID(),
      data.sku,
      data.name,
      data.category || null,
      data.description || null,
      data.referenceFobPrice || null,
      data.unitOfMeasure || 'pieza',
      data.isActive ?? true,
      now,
      now
    );
  }
}
