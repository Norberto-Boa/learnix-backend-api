import { FEE_SCOPE } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const updateFeeStructureSchema = z
  .object({
    feeTypeId: z.uuid().optional(),
    scope: z.enum(FEE_SCOPE).optional(),
    academicYearId: z.uuid().optional(),
    gradeId: z.uuid().nullable().optional(),
    amount: z.coerce.number().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização',
  });

export class UpdateFeeStructureDTO extends createZodDto(
  updateFeeStructureSchema,
) {}
