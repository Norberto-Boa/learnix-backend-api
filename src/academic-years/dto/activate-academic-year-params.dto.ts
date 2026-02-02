import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const activateAcademicYearSchema = z.object({
  id: z.uuid({ message: 'ID inválido' }),
});

export class ActivateAcademicYearDTO extends createZodDto(
  activateAcademicYearSchema,
) {}
