import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createAcademicYearSchema = z
  .object({
    year: z.number().int().min(2000).max(2100),
    label: z.string().min(1).max(100),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'Data do fim precisa ser posterior à data de início',
    path: ['endDate'],
  });

export class CreateAcademicYearDTO extends createZodDto(
  createAcademicYearSchema,
) {}
