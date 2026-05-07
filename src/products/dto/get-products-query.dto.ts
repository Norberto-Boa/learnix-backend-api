import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().trim().optional(),
});

export class GetProductsQueryDTO extends createZodDto(getProductsQuerySchema) {}
