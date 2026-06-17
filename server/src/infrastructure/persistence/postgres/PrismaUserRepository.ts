import prisma from '../../config/postgres';
import { User, UserRole } from '../../../domain/entities';
import type { UserStatus } from '../../../domain/entities';
import { IUserRepository } from '../../../domain/repositories';

export class PrismaUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const records = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return records.map(this.toDomain);
  }

  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const records = await prisma.user.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });
    return records.map(this.toDomain);
  }

  async create(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
        approvedBy: user.approvedBy,
        approvedAt: user.approvedAt,
        lastLogin: user.lastLogin
      }
    });
    return this.toDomain(created);
  }

  async update(user: User): Promise<User> {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
        approvedBy: user.approvedBy,
        approvedAt: user.approvedAt,
        lastLogin: user.lastLogin,
        updatedAt: user.updatedAt
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  private toDomain(record: any): User {
    return new User(
      record.id,
      record.email,
      record.passwordHash,
      record.name,
      record.role as UserRole,
      record.status as UserStatus,
      record.isActive,
      record.approvedBy ?? null,
      record.approvedAt ?? null,
      record.lastLogin,
      record.createdAt,
      record.updatedAt
    );
  }
}
