import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const cancelEnrollmentParamsSchema = z.object({
  id: z.uuid(),
});

export class CancelEnrollmentParamsDTO extends createZodDto(
  cancelEnrollmentParamsSchema,
) {}
