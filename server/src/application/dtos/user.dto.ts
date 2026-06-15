import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(1, 'Nombre requerido'),
  role: z.enum(['admin', 'supervisor', 'operator', 'reader']).optional().default('reader')
});

export const UpdateUserDto = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional(),
  role: z.enum(['admin', 'supervisor', 'operator', 'reader']).optional()
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string()
});

export type CreateUserInput = z.infer<typeof CreateUserDto>;
export type UpdateUserInput = z.infer<typeof UpdateUserDto>;
export type LoginInput = z.infer<typeof LoginDto>;
