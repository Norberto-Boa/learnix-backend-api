import { STUDENT_STATUS } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const getStudentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().optional(),
  status: z.enum(STUDENT_STATUS).optional(),
});

export class GetStudentsDTO extends createZodDto(getStudentsSchema) {}
