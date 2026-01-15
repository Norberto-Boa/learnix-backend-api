import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SchoolBaseSchema = z.object({
  name: z.string(),
  nuit: z
    .string()
    .regex(/^\d+$/, { message: 'Nuit so pode ter numeros' })
    .min(9, { message: 'Nuit invalido' })
    .max(9, { message: 'Nuit Invalido' }),
  slug: z.string(),
  status: z.string(),
});

export class SchoolBaseDTO extends createZodDto(SchoolBaseSchema) {}
