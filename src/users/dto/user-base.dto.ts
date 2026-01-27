import { ROLE } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserBaseSchema = z.object({
  name: z.string(),
  email: z.email().toLowerCase(),
  password: z.string().min(6),
  role: z.nativeEnum(ROLE),
});

export class UserBaseDto extends createZodDto(UserBaseSchema) {}
