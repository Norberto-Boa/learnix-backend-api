import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserBaseSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export class UserBaseDto extends createZodDto(UserBaseSchema) {}
