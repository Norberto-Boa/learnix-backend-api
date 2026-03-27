import { FEE_TYPE_CATEGORY } from "@/generated/prisma/enums";
import { z } from "zod";
import { createZodDto } from 'nestjs-zod';

export const createFeeTypeSchema = z.object({
  name: z.string().trim().min(1),
  code: z.string().trim().min(1),
  category: z.enum(FEE_TYPE_CATEGORY).optional(),
  isRecurring: z.boolean().optional()
})

export class CreateFeeTypeDTO extends createZodDto(createFeeTypeSchema) { }