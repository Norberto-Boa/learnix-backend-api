import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const getPenaltyPoliciesQuerySchema = z.object({
  page: z.coerce.number().int().positive().min(1).max(20).optional().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .min(1)
    .max(20)
    .optional()
    .default(10),
  search: z.string().trim().optional(),
  academicYearId: z.uuid().optional(),
  gradeId: z.uuid().optional(),
  triggerFeeTypeId: z.uuid().optional(),
  penaltyFeeTypeId: z.uuid().optional(),
  isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      if (typeof value === 'boolean') return value;
      return value === 'true';
    }),
});

export class GetPenaltyPoliciesQueryDTO extends createZodDto(
  getPenaltyPoliciesQuerySchema,
) {}
