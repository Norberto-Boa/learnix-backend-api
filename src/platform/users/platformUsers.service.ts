import { AuditService } from '@/audit/audit.service';
import type { ROLE } from '@/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: ROLE;
  schoolId: string;
}

@Injectable()
export class PlatformUsersService {
  constructor(
    private prismaService: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(
    { name, email, password, role, schoolId }: CreateUserInput,
    performedByUserId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const user = await this.prismaService.user.create({
        data: {
          name,
          email,
          password,
          role,
          schoolId,
        },
      });

      await this.auditService.log(
        {
          action: 'CREATE_USER',
          entity: 'USER',
          entityId: user.id,
          userId: performedByUserId,
          schoolId: schoolId,
          newData: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
        tx,
      );

      return user;
    });
  }
}
