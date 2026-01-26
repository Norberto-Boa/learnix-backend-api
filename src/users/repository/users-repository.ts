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
    return client.user.create({
      data: {
        name,
        email,
        password,
        role,
        schoolId,
      },
    });
  }
}
