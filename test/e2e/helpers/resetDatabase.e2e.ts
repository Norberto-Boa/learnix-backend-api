import type { PrismaClient } from '@/generated/prisma/client';

export async function resetdb(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await prisma.$executeRawUnsafe(`
      DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename <> '_prisma_migrations'
      ) LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" CASCADE';
      END LOOP;
    END $$;
    `);
  });
}
