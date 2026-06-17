export enum UserRole {
  ADMIN = 'admin',
  CONSULTOR = 'consultor',
  ANALISTA = 'analista'
}

export type UserStatus = 'pending' | 'approved' | 'rejected';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public name: string,
    public role: UserRole,
    public status: UserStatus,
    public isActive: boolean,
    public approvedBy: string | null,
    public approvedAt: Date | null,
    public lastLogin: Date | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<User, 'id' | 'status' | 'isActive' | 'approvedBy' | 'approvedAt' | 'lastLogin' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    status?: UserStatus;
    isActive?: boolean;
    approvedBy?: string | null;
    approvedAt?: Date | null;
    lastLogin?: Date | null;
  }): User {
    const now = new Date();
    return new User(
      data.id || crypto.randomUUID(),
      data.email,
      data.passwordHash,
      data.name,
      data.role || UserRole.ANALISTA,
      data.status || 'pending',
      data.isActive ?? true,
      data.approvedBy || null,
      data.approvedAt || null,
      data.lastLogin || null,
      now,
      now
    );
  }
}
