import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateClassroomSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  capacity: z.number().int().positive('Capacity must be greater than zero'),
  gradeId: z.string().uuid('Grade id must be a valid UUID'),
  academicYearId: z.string().uuid('Academic year id must be a valid UUID'),
});

export class CreateClassroomDTO extends createZodDto(CreateClassroomSchema) {}
