import { z } from 'zod';

export const CreateImportDto = z.object({
  importNumber: z.string().min(1, 'Número de importación requerido'),
  estimatedArrival: z.string().nullable().optional()
});

export const UpdateImportDto = z.object({
  importNumber: z.string().min(1).optional(),
  estimatedArrival: z.string().nullable().optional()
});

export const UpdateImportStatusDto = z.object({
  status: z.enum(['draft', 'in_progress', 'arrived', 'closed'])
});

export type CreateImportInput = z.infer<typeof CreateImportDto>;
export type UpdateImportInput = z.infer<typeof UpdateImportDto>;
export type UpdateImportStatusInput = z.infer<typeof UpdateImportStatusDto>;
