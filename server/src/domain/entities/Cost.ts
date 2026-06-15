export enum CostCategory {
  CUSTOMS = 'customs',
  FREIGHT = 'freight',
  INSURANCE = 'insurance',
  STORAGE = 'storage',
  BROKERAGE = 'brokerage',
  OTHER = 'other'
}

export class Cost {
  constructor(
    public readonly id: string,
    public importId: string,
    public concept: string,
    public category: CostCategory,
    public amount: number,
    public currency: string,
    public description: string | null,
    public isAllocated: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<Cost, 'id' | 'isAllocated' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    isAllocated?: boolean;
  }): Cost {
    const now = new Date();
    return new Cost(
      data.id || crypto.randomUUID(),
      data.importId,
      data.concept,
      data.category,
      data.amount,
      data.currency || 'USD',
      data.description || null,
      data.isAllocated ?? false,
      now,
      now
    );
  }
}
