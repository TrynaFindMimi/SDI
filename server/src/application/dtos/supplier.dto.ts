import { z } from 'zod';

export const CreateSupplierDto = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  country: z.string().min(1, 'País requerido'),
  contactName: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  taxId: z.string().nullable().optional()
});

export const UpdateSupplierDto = z.object({
  name: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  contactName: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  taxId: z.string().nullable().optional(),
  isActive: z.boolean().optional()
});

export type CreateSupplierInput = z.infer<typeof CreateSupplierDto>;
export type UpdateSupplierInput = z.infer<typeof UpdateSupplierDto>;
