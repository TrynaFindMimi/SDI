import { z } from 'zod';

export const CreateCostDto = z.object({
  concept: z.string().min(1, 'Concepto requerido'),
  category: z.enum(['customs', 'freight', 'insurance', 'storage', 'brokerage', 'other']),
  amount: z.number().positive('Monto debe ser positivo'),
  currency: z.string().optional().default('USD'),
  description: z.string().nullable().optional()
});

export const UpdateCostDto = z.object({
  concept: z.string().min(1).optional(),
  category: z.enum(['customs', 'freight', 'insurance', 'storage', 'brokerage', 'other']).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  description: z.string().nullable().optional()
});

export type CreateCostInput = z.infer<typeof CreateCostDto>;
export type UpdateCostInput = z.infer<typeof UpdateCostDto>;
