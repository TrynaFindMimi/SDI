import { z } from 'zod';

export const CreateCatalogProductDto = z.object({
  sku: z.string().min(1, 'SKU requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  category: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  referenceFobPrice: z.number().positive().nullable().optional(),
  unitOfMeasure: z.string().optional().default('pieza')
});

export const UpdateCatalogProductDto = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  category: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  referenceFobPrice: z.number().positive().nullable().optional(),
  unitOfMeasure: z.string().optional(),
  isActive: z.boolean().optional()
});

export type CreateCatalogProductInput = z.infer<typeof CreateCatalogProductDto>;
export type UpdateCatalogProductInput = z.infer<typeof UpdateCatalogProductDto>;
