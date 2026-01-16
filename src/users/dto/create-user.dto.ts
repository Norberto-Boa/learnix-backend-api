import { createZodDto } from 'nestjs-zod';
import { UserBaseSchema } from './user-base.dto';
import z from 'zod';

export const CreateUserSchema = UserBaseSchema.extend({
  schoolId: z.uuid(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
