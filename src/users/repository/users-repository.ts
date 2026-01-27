import type { User } from '@/generated/prisma/client';
import type { ROLE } from '@/generated/prisma/enums';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

interface saveUser {
  name: string;
  email: string;
  password: string;
  role: ROLE;
  schoolId: string;
}

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async save(
    { name, email, password, role, schoolId }: saveUser,
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.prismaService;
    return await client.user.create({
      data: {
        name,
        email,
        password,
        role,
        schoolId,
      },
    });
  }

  async findById(
    id: string,
    tx?: TransactionClient,
  ): Promise<Omit<User, 'password' | 'schoolId' | 'deletedAt'> | null> {
    const client = tx ?? this.prismaService;
    return await client.user.findUnique({
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

  async findByEmail(
    email: string,
    tx?: TransactionClient,
  ): Promise<Omit<User, 'password' | 'schoolId' | 'deletedAt'> | null> {
    const client = tx ?? this.prismaService;
    return await client.user.findUnique({
      where: {
        email,
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
}
