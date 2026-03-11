import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateClassroomSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    capacity: z.number().int().positive('Capacity must be greater than zero'),
  })
  .refine((data) => data.name !== undefined || data.capacity !== undefined, {
    message: 'Pelo menos um campo deve ser editado!',
  });

export class UpdateClassroomDTO extends createZodDto(UpdateClassroomSchema) {}
