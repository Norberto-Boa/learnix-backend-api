import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolsService {
  constructor(private prismaService: PrismaService) {}

  async findSchoolByNuit(nuit: string) {
    return await this.prismaService.school.findUnique({
      where: {
        nuit,
      },
    });
  }

  async findSchoolByslug(slug: string) {
    return await this.prismaService.school.findUnique({
      where: {
        slug,
      },
    });
  }

  async findSchoolById(id: string) {
    return await this.prismaService.school.findUnique({
      where: {
        id,
      },
    });
  }
}
