import { GENDER, STUDENT_STATUS } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string('Nome é obrigatório'),
  registrationNumber: z.string(),
  dateOfBirth: z.date(),
  gender: z.enum(GENDER),
  status: z.enum(STUDENT_STATUS),
  documentTypeId: z.string(),
  documentNumber: z.string(),
  documentUrl: z.url().optional(),
});

export class CreateStudentDTO extends createZodDto(createStudentSchema) {}
