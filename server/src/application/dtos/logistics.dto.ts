import { z } from 'zod';

export const CreateLogisticsDto = z.object({
  supplierId: z.string().uuid().nullable().optional(),
  brokerName: z.string().nullable().optional(),
  brokerContact: z.string().nullable().optional(),
  incoterm: z.string().min(1, 'Incoterm requerido'),
  originCountry: z.string().nullable().optional(),
  destinationCountry: z.string().optional().default('México'),
  shippingMethod: z.string().nullable().optional(),
  trackingNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

export type CreateLogisticsInput = z.infer<typeof CreateLogisticsDto>;
