import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const GetClassroomsParamsSchema = z.object({
  gradeId: z.uuid().optional,
  academicYearId: z.uuid(),
  search: z.string().trim().optional(),
});

export class GetClassroomsParamsDTO extends createZodDto(
  GetClassroomsParamsSchema,
) {}
