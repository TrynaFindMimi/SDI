import { z } from 'zod';

export const CreateProductDto = z.object({
  catalogProductId: z.string().uuid().nullable().optional(),
  sku: z.string().min(1, 'SKU requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  quantity: z.number().int().positive('Cantidad debe ser positiva'),
  fobPrice: z.number().positive('Precio FOB debe ser positivo'),
  expectedMargin: z.number().min(0).optional().default(0),
  notes: z.string().nullable().optional()
});

export const UpdateProductDto = z.object({
  quantity: z.number().int().positive().optional(),
  fobPrice: z.number().positive().optional(),
  expectedMargin: z.number().min(0).optional(),
  notes: z.string().nullable().optional()
});

export type CreateProductInput = z.infer<typeof CreateProductDto>;
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
