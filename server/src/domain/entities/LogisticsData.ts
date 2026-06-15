export class LogisticsData {
  constructor(
    public readonly id: string,
    public importId: string,
    public supplierId: string | null,
    public brokerName: string | null,
    public brokerContact: string | null,
    public incoterm: string,
    public originCountry: string | null,
    public destinationCountry: string,
    public shippingMethod: string | null,
    public trackingNumber: string | null,
    public notes: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<LogisticsData, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
  }): LogisticsData {
    const now = new Date();
    return new LogisticsData(
      data.id || crypto.randomUUID(),
      data.importId,
      data.supplierId || null,
      data.brokerName || null,
      data.brokerContact || null,
      data.incoterm,
      data.originCountry || null,
      data.destinationCountry || 'México',
      data.shippingMethod || null,
      data.trackingNumber || null,
      data.notes || null,
      now,
      now
    );
  }
}
