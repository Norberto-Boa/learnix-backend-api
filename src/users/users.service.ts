import type { User } from '@/generated/prisma/browser';
import type { Prisma, ROLE } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { UsersRepository } from './repository/users-repository';
import type { AuditService } from '@/audit/audit.service';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: ROLE;
  schoolId: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private usersRepository: UsersRepository,
    private auditService: AuditService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(
    id: string,
  ): Promise<Omit<User, 'password' | 'schoolId' | 'deletedAt'> | null> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        role: true,
        updatedAt: true,
        status: true,
      },
    });
  }

  async create(
    { email, name, password, role, schoolId }: CreateUserInput,
    performedByUserId: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const user = await this.usersRepository.save({
        name,
        email,
        password,
        role,
        schoolId,
      });

      await this.auditService.log(
        {
          action: 'CREATE_USER',
          entity: 'USER',
          userId: performedByUserId,
          schoolId: schoolId,
          entityId: user.id,
          newData: {
            id: user.id,
            schoolId: user.schoolId,
          },
        },
        tx,
      );

      return user;
    });
  }
}
