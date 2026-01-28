import type { User } from '@/generated/prisma/client';
import type { ROLE } from '@/generated/prisma/enums';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import { PrismaService } from '@/prisma/prisma.service';
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

  async findById(id: string, tx?: TransactionClient): Promise<User | null> {
    const client = tx ?? this.prismaService;
    return await client.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(
    email: string,
    tx?: TransactionClient,
  ): Promise<User | null> {
    const client = tx ?? this.prismaService;
    return await client.user.findUnique({
      where: {
        email,
      },
    });
  }
}
