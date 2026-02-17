import type { Prisma } from '@/generated/prisma/client';

export type DbContext = Prisma.TransactionClient;
