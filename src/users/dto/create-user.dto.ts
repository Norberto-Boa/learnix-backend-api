import { createZodDto } from 'nestjs-zod';
import { UserBaseSchema } from './user-base.dto';

export const CreateUserSchema = UserBaseSchema;

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
