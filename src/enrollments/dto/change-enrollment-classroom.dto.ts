import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const changeEnrollmentClassroomParamsSchema = z.object({
  id: z.uuid(),
});

export class ChangeEnrollmentClassroomParamsDTO extends createZodDto(
  changeEnrollmentClassroomParamsSchema,
) {}
