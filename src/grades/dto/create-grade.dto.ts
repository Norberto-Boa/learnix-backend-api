import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createGradeSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  order: z.number().int().min(1, 'Order must be greater than 0'),
});

export class CreateGradeDTO extends createZodDto(createGradeSchema) {}
