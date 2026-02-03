import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createDocumentTypeSchema = z.object({
  type: z
    .string({ message: 'O documento deve ter um tipo' })
    .min(2, 'Tipo deve ter no minimo 2 caracteres')
    .max(20, 'Tipo deve ter no maximo 20 caracteres')
    .transform((value) => value.trim().toUpperCase()),
  label: z
    .string('O tipo deve ter uma label')
    .min(2, 'Label deve ter no minimo 2 caracteres')
    .max(50, 'Label deve ter no maximo 50 caracteress')
    .transform((value) => value.trim()),
});

export class CreateDocumentTypeDTO extends createZodDto(
  createDocumentTypeSchema,
) {}
