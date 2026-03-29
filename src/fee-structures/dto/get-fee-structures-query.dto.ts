import { FEE_SCOPE } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const getFeeStructuresQuerySchema = z.object({
  feeTypeId: z.uuid().optional(),
  academicYearId: z.uuid().optional(),
  gradeId: z.uuid().optional(),
  scope: z.enum(FEE_SCOPE).optional(),
});

export class GetFeeStructuresQueryDTO extends createZodDto(
  getFeeStructuresQuerySchema,
) {}
