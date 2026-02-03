import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const documentTypeIdParamSchema = z.object({
  id: z.uuid('ID invalido'),
});

export class DocumentTypedIdParamDTO extends createZodDto(
  documentTypeIdParamSchema,
) {}
