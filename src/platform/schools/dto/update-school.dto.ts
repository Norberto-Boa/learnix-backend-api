import { STATUS } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const updateSchoolSchema = z.object({
  name: z.string().optional(),
  nuit: z
    .string()
    .regex(/^\d+$/, { message: 'Nuit so pode ter numeros' })
    .min(9, { message: 'Nuit invalido' })
    .max(9, { message: 'Nuit Invalido' })
    .optional(),
  status: z.nativeEnum(STATUS).optional(),
});

export class UpdateSchoolDTO extends createZodDto(updateSchoolSchema) {}
