import type { SchoolCreateInput } from '@/generated/prisma/models';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlatformSchoolsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    { name, nuit, slug, status }: SchoolCreateInput,
    userId: string,
  ) {
    const school = await this.prismaService.school.create({
      data: {
        name,
        nuit,
        slug,
        status,
      },
    });

    return {
      message: 'School succesfully created',
      escolaId: school.id,
    };
  }
}
