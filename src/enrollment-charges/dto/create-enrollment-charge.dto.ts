import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createEnrollmentChargeSchema = z.object({
  enrollmentId: z.uuid(),
  feeTypeId: z.uuid(),
  academicYearId: z.uuid(),

  referenceYear: z.coerce.number().int().min(2000),
  referenceMonth: z.coerce.number().int().min(1).max(12),

  dueDate: z.iso.date(),

  baseAmount: z.coerce.number().positive(),
  penaltyAmount: z.coerce.number().min(0).optional().default(0),
});

export class CreateEnrollmentChargeDTO extends createZodDto(
  createEnrollmentChargeSchema,
) {}
