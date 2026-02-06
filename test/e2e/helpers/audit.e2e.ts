import { PrismaService } from '@/prisma/prisma.service';

interface TestAuditLogParams {
  prisma: PrismaService;
  action: string;
  entity: string;
  schoolId: string;
  userId: string;
}

export async function testAuditLog({
  prisma,
  action,
  entity,
  schoolId,
  userId,
}: TestAuditLogParams) {
  const audit = await prisma.auditLog.findFirst({
    where: {
      action,
      entity,
      schoolId,
      userId,
    },
  });

  expect(audit).toBeDefined();
  expect(audit?.createdAt).toBeInstanceOf(Date);
}
