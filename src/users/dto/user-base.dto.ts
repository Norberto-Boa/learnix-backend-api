import { z } from 'zod';

export const UserBaseDto = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserBaseDto = z.infer<typeof UserBaseDto>;
