import { GENDER } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(GENDER).optional(),
});

export class UpdateStudentDTO extends createZodDto(updateStudentSchema) {}
