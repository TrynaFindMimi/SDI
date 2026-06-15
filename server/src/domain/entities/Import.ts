export enum ImportStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  ARRIVED = 'arrived',
  CLOSED = 'closed'
}

export class Import {
  constructor(
    public readonly id: string,
    public importNumber: string,
    public status: ImportStatus,
    public startDate: Date,
    public estimatedArrival: Date | null,
    public closeDate: Date | null,
    public arrivalDate: Date | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<Import, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'closeDate' | 'arrivalDate'> & {
    id?: string;
    status?: ImportStatus;
    closeDate?: Date | null;
    arrivalDate?: Date | null;
  }): Import {
    const now = new Date();
    return new Import(
      data.id || crypto.randomUUID(),
      data.importNumber,
      data.status || ImportStatus.DRAFT,
      data.startDate,
      data.estimatedArrival,
      data.closeDate || null,
      data.arrivalDate || null,
      now,
      now
    );
  }

  updateStatus(newStatus: ImportStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
    if (newStatus === ImportStatus.CLOSED) {
      this.closeDate = new Date();
    }
    if (newStatus === ImportStatus.ARRIVED) {
      this.arrivalDate = new Date();
    }
  }

  isClosed(): boolean {
    return this.status === ImportStatus.CLOSED;
  }
}
