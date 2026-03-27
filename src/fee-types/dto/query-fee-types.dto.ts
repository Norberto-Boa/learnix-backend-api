import { FEE_TYPE_CATEGORY } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const queryFeeTypesSchema = z.object({
  search: z.string().trim().optional(),
  category: z.enum(FEE_TYPE_CATEGORY).optional(),
  isRecurring: z.union([
    z.boolean(),
    z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
  ]),
});

export class QueryFeeTypesDTO extends createZodDto(queryFeeTypesSchema) { }
