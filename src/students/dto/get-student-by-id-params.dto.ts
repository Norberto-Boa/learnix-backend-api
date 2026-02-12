import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const getStudentByIdParamsSchema = z.object({
  id: z.uuid(),
});

export class GetStudentByIdParamsDTO extends createZodDto(
  getStudentByIdParamsSchema,
) {}
