import type { UserPayload } from '@/auth/types/user-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthResult {
  token: string;
  user: UserPayload;
}

export async function authenticateAsSuperAdmin(
  app: INestApplication,
): Promise<AuthResult> {
  const prisma = app.get(PrismaService);
  const jwt = app.get(JwtService);

  const superAdmin = await prisma.user.findFirst({
    where: {
      role: 'SUPERADMIN',
    },
  });

  if (!superAdmin) {
    throw new Error('Admin user not Found! Check if seed worked!');
  }

  const token = jwt.sign({
    sub: superAdmin.id,
    role: superAdmin.role,
    schoolId: superAdmin.schoolId,
  });

  return {
    token,
    user: {
      userId: superAdmin.id,
      role: superAdmin.role,
      schoolId: superAdmin.schoolId ?? undefined,
    },
  };
}
