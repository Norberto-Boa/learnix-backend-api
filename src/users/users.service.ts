import type { User } from '@/generated/prisma/browser';
import type { ROLE } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users-repository';
import { AuditService } from '@/audit/audit.service';
import * as bcrypt from 'bcryptjs';

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
    return await this.usersRepository.findByEmail(email);
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  async create(
    { email, name, role, schoolId }: Omit<CreateUserInput, 'password'>,
    performedByUserId: string,
  ) {
    const password = 'AdminLearnix123';
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService.$transaction(async (tx) => {
      const user = await this.usersRepository.save({
        name,
        email,
        password: hashedPassword,
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
