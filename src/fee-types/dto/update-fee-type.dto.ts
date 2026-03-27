import { FEE_TYPE_CATEGORY } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const updateFeeTypeSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    code: z.string().trim().min(1).optional(),
    category: z.enum(FEE_TYPE_CATEGORY).optional(),
    isRecurring: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.code !== undefined ||
      data.isRecurring !== undefined ||
      data.category !== undefined,
    {
      message: 'At least one field must be provided',
    },
  );

export const updateFeeTypeParamsSchema = z.object({
  id: z.uuid()
})



export class UpdateFeeTypeDTO extends createZodDto(updateFeeTypeSchema) { }
export class UpdateFeeTypeParamsDTO extends createZodDto(updateFeeTypeParamsSchema) { }
