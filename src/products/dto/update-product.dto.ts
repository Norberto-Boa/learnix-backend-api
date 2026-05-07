import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    code: z.string().trim().min(1).optional(),
    price: z.coerce.number().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export class UpdateProductDto extends createZodDto(updateProductSchema) {}
