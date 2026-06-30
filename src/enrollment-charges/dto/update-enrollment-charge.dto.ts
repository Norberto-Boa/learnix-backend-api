import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateEnrollmentChargeSchema = z.object({
  dueDate: z.iso.date(),
  baseAmount: z.coerce.number().positive().optional(),
  penaltyAmount: z.coerce.number().min(0).optional(),
});

export class UpdateEnrollmentChargeDto extends createZodDto(
  updateEnrollmentChargeSchema,
) {}
