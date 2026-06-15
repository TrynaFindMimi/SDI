export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  OPERATOR = 'operator',
  READER = 'reader'
}

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public name: string,
    public role: UserRole,
    public isActive: boolean,
    public lastLogin: Date | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<User, 'id' | 'isActive' | 'lastLogin' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    isActive?: boolean;
    lastLogin?: Date | null;
  }): User {
    const now = new Date();
    return new User(
      data.id || crypto.randomUUID(),
      data.email,
      data.passwordHash,
      data.name,
      data.role || UserRole.READER,
      data.isActive ?? true,
      data.lastLogin || null,
      now,
      now
    );
  }
}
