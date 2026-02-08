import { GENDER, STUDENT_STATUS } from '@/generated/prisma/enums';
import { z } from 'zod';

const createStudent = z.object({
  name: z.string('Nome é obrigatório'),
  registrationNumbe: z.string(),
  dateOfBirth: z.date(),
  gender: z.enum(GENDER),
  status: z.enum(STUDENT_STATUS),
  schoolId: z.uuid(),
});
