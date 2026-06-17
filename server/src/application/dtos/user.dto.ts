import { z } from 'zod';

export const RegisterDto = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  passwordConfirm: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['consultor', 'analista'], {
    errorMap: () => ({ message: 'Rol inválido. Debe ser consultor o analista' })
  })
}).refine(data => data.password === data.passwordConfirm, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirm']
});

export const CreateUserDto = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(1, 'Nombre requerido'),
  role: z.enum(['admin', 'consultor', 'analista']).optional().default('analista')
});

export const UpdateUserDto = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional(),
  role: z.enum(['admin', 'consultor', 'analista']).optional()
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string()
});

export type RegisterInput = z.infer<typeof RegisterDto>;
export type CreateUserInput = z.infer<typeof CreateUserDto>;
export type UpdateUserInput = z.infer<typeof UpdateUserDto>;
export type LoginInput = z.infer<typeof LoginDto>;
