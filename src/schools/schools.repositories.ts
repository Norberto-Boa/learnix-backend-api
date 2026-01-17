import type {
  SchoolCreateInput,
  TransactionClient,
} from '@/generated/prisma/internal/prismaNamespace';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolsRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string) {
    return this.prismaService.school.findFirst({
      where: {
        id,
      },
    });
  }

  async findByNuit(nuit: string) {
    return this.prismaService.school.findFirst({
      where: {
        nuit,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prismaService.school.findFirst({
      where: {
        slug,
      },
    });
  }

  async create({ name, slug, nuit }: SchoolCreateInput, tx: TransactionClient) {
    return tx.school.create({
      data: {
        name,
        nuit,
        slug,
        status,
      },
    });
  }

  async softDelete(id: string, tx?: TransactionClient) {
    const client = tx ?? this.prismaService;
    return client.school.delete({ where: { id } });
  }
}
