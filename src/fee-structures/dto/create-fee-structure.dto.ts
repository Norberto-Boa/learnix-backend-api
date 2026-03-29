import { FEE_SCOPE } from '@/generated/prisma/enums';
import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createFeeStructureSchema = z
  .object({
    feeTypeId: z.uuid(),
    scope: z.enum(FEE_SCOPE),
    academicYearId: z.uuid(),
    gradeId: z.uuid().nullable().optional(),
    amount: z.coerce.number().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.scope === FEE_SCOPE.SCHOOL && data.gradeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['gradeId'],
        message: 'Uma despesa de escola nao pode ter uma turma associada!',
      });
    }

    if (data.scope === FEE_SCOPE.GRADE && !data.gradeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['gradeId'],
        message: 'Uma despesa de turma deve ter uma turma associada!',
      });
    }
  });

export class CreateFeeStructureDTO extends createZodDto(
  createFeeStructureSchema,
) {}
