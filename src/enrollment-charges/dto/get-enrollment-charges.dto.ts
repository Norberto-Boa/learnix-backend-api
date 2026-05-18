import { CHARGE_STATUS } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const getEnrollmentChargesSchema = z.object({
  enrollmentId: z.uuid().optional(),
  academicYearId: z.uuid().optional(),
  referenceYear: z.coerce.number().int().min(2000).optional(),
  referenceMonth: z.coerce.number().int().min(1).max(12).optional(),
  status: z.nativeEnum(CHARGE_STATUS).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export class GetEnrollmentChargesDto extends createZodDto(
  getEnrollmentChargesSchema,
) {}
