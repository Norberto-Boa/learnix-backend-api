import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

export const cancelEnrollmentParamsSchema = z.object({
  id: z.uuid(),
});

export class CancelEnrollmentParamsDTO extends createZodDto(
  cancelEnrollmentParamsSchema,
) {}
