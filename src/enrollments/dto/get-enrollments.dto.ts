import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

export const GetEnrollmentsParamsSchema = z.object({
  classroomId: z.uuid().optional(),
  academicYearId: z.uuid().optional(),
  studentId: z.uuid().optional(),
  status: z
    .nativeEnum(ENROLLMENT_STATUS)
    .optional()
    .default(ENROLLMENT_STATUS.ACTIVE),
});

export class GetEnrollmentsParamsDTO extends createZodDto(
  GetEnrollmentsParamsSchema,
) {}
