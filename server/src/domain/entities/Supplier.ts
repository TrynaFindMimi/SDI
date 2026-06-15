export class Supplier {
  constructor(
    public readonly id: string,
    public name: string,
    public country: string,
    public contactName: string | null,
    public contactEmail: string | null,
    public contactPhone: string | null,
    public address: string | null,
    public taxId: string | null,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<Supplier, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    isActive?: boolean;
  }): Supplier {
    const now = new Date();
    return new Supplier(
      data.id || crypto.randomUUID(),
      data.name,
      data.country,
      data.contactName || null,
      data.contactEmail || null,
      data.contactPhone || null,
      data.address || null,
      data.taxId || null,
      data.isActive ?? true,
      now,
      now
    );
  }
}
