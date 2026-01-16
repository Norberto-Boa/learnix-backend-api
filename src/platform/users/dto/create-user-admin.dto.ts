import { CreateUserSchema } from '@/users/dto/create-user.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserAdminSchema = CreateUserSchema.extend({
  schoolId: z.uuid(),
}).omit({
  password: true,
});

export class CreateUserAdminDTO extends createZodDto(createUserAdminSchema) {}
