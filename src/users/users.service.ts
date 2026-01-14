import type { User } from '@/generated/prisma/browser';
<<<<<<< HEAD
import type { PrismaService } from '@/prisma/prisma.service';
=======
import { PrismaService } from '@/prisma/prisma.service';
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff
import { Injectable } from '@nestjs/common';

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
}
