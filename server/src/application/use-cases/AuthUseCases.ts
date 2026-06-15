import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories';
import { User, UserRole } from '../../domain/entities';
import { CreateUserInput, LoginInput, UpdateUserInput } from '../dtos';

export class AuthUseCases {
  constructor(private userRepository: IUserRepository) {}

  async login(data: LoginInput): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new Error('Usuario desactivado');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    user.lastLogin = new Date();
    await this.userRepository.update(user);

    const { passwordHash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
      return this.userRepository.findById(decoded.userId);
    } catch {
      return null;
    }
  }

  async create(data: CreateUserInput): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Ya existe un usuario con ese email');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = User.create({
      email: data.email,
      passwordHash,
      name: data.name,
      role: (data.role as UserRole) || UserRole.READER
    });

    const created = await this.userRepository.create(user);
    const { passwordHash: _, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  async getAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userRepository.findAll();
    return users.map(({ passwordHash, ...rest }) => rest);
  }

  async getById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async update(id: string, data: UpdateUserInput): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new Error('Ya existe un usuario con ese email');
      }
      user.email = data.email;
    }

    if (data.password) {
      user.passwordHash = await bcrypt.hash(data.password, 10);
    }

    if (data.name) user.name = data.name;
    if (data.role) user.role = data.role as UserRole;

    user.updatedAt = new Date();
    const updated = await this.userRepository.update(user);
    const { passwordHash, ...rest } = updated;
    return rest;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return this.userRepository.delete(id);
  }
}
