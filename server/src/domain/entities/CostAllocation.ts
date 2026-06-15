export class CostAllocation {
  constructor(
    public readonly id: string,
    public costId: string,
    public importedProductId: string,
    public allocatedAmount: number,
    public allocationMethod: string,
    public createdAt: Date
  ) {}

  static create(data: Omit<CostAllocation, 'id' | 'createdAt'> & {
    id?: string;
  }): CostAllocation {
    return new CostAllocation(
      data.id || crypto.randomUUID(),
      data.costId,
      data.importedProductId,
      data.allocatedAmount,
      data.allocationMethod || 'proportional',
      new Date()
    );
  }
}
