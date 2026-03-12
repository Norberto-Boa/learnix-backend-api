import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

export const CreateEnrollmentSchema = z.object({
  studentId: z.uuid('Selecione um estudante por favor!'),
  classroomId: z.uuid('Selecione a classe por favor!'),
  academicYearId: z.uuid('Selecione o ano que pretende matricular a crianca'),
  status: z
    .nativeEnum(ENROLLMENT_STATUS)
    .optional()
    .default(ENROLLMENT_STATUS.ACTIVE),
});

export class CreateEnrollmentDTO extends createZodDto(CreateEnrollmentSchema) {}
