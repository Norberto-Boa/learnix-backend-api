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
  constructor(private prismaService: PrismaService) {}

  async create({ name, email, password, role, schoolId }: CreateUserInput) {
    return await this.prismaService.user.create({
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
