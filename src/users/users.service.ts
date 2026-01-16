import type { User } from '@/generated/prisma/browser';
import type { Prisma, ROLE } from '@/generated/prisma/client';
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
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(
    id: string,
  ): Promise<Omit<User, 'password' | 'schoolId'> | null> {
    return await this.prisma.user.findUnique({
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
      },
    });
  }

  async create({ email, name, password, role, schoolId }: CreateUserInput) {
    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        role,
        schoolId,
      },
    });
  }
}
