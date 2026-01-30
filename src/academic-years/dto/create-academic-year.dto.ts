import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createAcademicYearSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  label: z.string().min(1).max(100),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().optional(),
});

export class CreateAcademicYearDTO extends createZodDto(
  createAcademicYearSchema,
) {}
