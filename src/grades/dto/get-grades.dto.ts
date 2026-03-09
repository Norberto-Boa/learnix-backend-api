import { STUDENT_STATUS } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const getGradesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().optional(),
});

export class GetGradesDTO extends createZodDto(getGradesSchema) {}
