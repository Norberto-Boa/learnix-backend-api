import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2),
  code: z.string().trim().min(1),
  price: z.coerce.number().positive(),
});

export class CreateProductDto extends createZodDto(createProductSchema) {}
