import { Injectable } from '@nestjs/common';
import type {
  CreateGradeData,
  GetGradesParams,
  GradesRepository,
  UpdateGradeData,
} from '../grades.repository';
import { PrismaService } from '@/prisma/prisma.service';
import type { DbContext } from '@/prisma/shared/db-context';
import type { GradeDomainProps } from '@/grades/domain/grade';

@Injectable()
export class PrismaGradesRepository implements GradesRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(db?: DbContext) {
    return db ?? this.prisma;
  }

  async save(data: CreateGradeData, db: DbContext) {
    const client = this.getClient(db);

    return await client.grade.create({
      data,
    });
  }

  async findMany(params: GetGradesParams) {
    const { schoolId, page, limit, search } = params;

    const where = {
      schoolId,
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const [grades, total] = await Promise.all([
      this.prisma.grade.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prisma.grade.count({ where }),
    ]);

    return {
      grades,
      total,
    };
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<GradeDomainProps | null> {
    return await this.prisma.grade.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
    });
  }

  async findByName(
    name: string,
    schoolId: string,
  ): Promise<GradeDomainProps | null> {
    return this.prisma.grade.findFirst({
      where: {
        name,
        schoolId,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateGradeData,
    db?: DbContext,
  ): Promise<GradeDomainProps> {
    return await this.prisma.grade.update({
      where: {
        id,
        schoolId,
      },
      data,
    });
  }

  async softDelete(
    id: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<void> {
    const client = this.getClient(db);

    await client.grade.update({
      where: {
        id,
        schoolId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
