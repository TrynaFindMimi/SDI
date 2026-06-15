export class ImportedProduct {
  constructor(
    public readonly id: string,
    public importId: string,
    public catalogProductId: string | null,
    public sku: string,
    public name: string,
    public quantity: number,
    public fobPrice: number,
    public expectedMargin: number,
    public notes: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<ImportedProduct, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
  }): ImportedProduct {
    const now = new Date();
    return new ImportedProduct(
      data.id || crypto.randomUUID(),
      data.importId,
      data.catalogProductId || null,
      data.sku,
      data.name,
      data.quantity,
      data.fobPrice,
      data.expectedMargin || 0,
      data.notes || null,
      now,
      now
    );
  }

  get fobValue(): number {
    return this.quantity * this.fobPrice;
  }

  get expectedRevenue(): number {
    return this.fobValue * (1 + this.expectedMargin / 100);
  }
}
