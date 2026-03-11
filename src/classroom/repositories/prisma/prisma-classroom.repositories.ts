import { Injectable } from '@nestjs/common';
import type {
  ClassroomRepository,
  CreateClassroomData,
  GetClassroomsParams,
  GetUniqueClassroomParams,
  UpdateClassroomData,
} from '../classroom.repository';
import { PrismaService } from '@/prisma/prisma.service';
import type { DbContext } from '@/prisma/shared/db-context';
import type { ClassroomDomain } from '@/classroom/domain/classroom';

@Injectable()
export class PrismaClassroomRepository implements ClassroomRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(db?: DbContext) {
    return db ?? this.prisma;
  }

  async save(
    data: CreateClassroomData,
    db: DbContext,
  ): Promise<ClassroomDomain> {
    const client = this.getClient(db);

    return await client.classroom.create({
      data,
    });
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<ClassroomDomain | null> {
    return await this.prisma.classroom.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
    });
  }

  async findByUniqueKeys(
    params: GetUniqueClassroomParams,
    schoolId: string,
  ): Promise<ClassroomDomain | null> {
    return await this.prisma.classroom.findFirst({
      where: {
        schoolId: schoolId,
        name: params.name,
        gradeId: params.gradeId,
        academicYearId: params.academicYearId,
        deletedAt: null,
      },
    });
  }

  async findMany(
    params: GetClassroomsParams,
    schoolId: string,
  ): Promise<ClassroomDomain[]> {
    return this.prisma.classroom.findMany({
      where: {
        schoolId: schoolId,
        deletedAt: null,
        ...(params.academicYearId && { academicYearId: params.academicYearId }),
        ...(params.gradeId && { gradeId: params.gradeId }),
        ...(params.search && {
          name: {
            contains: params.search,
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        grade: {
          order: 'asc',
        },
      },
    });
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateClassroomData,
    db?: DbContext,
  ) {
    const client = this.getClient(db);

    return await client.classroom.update({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
      data,
    });
  }

  async delete(id: string, schoolId: string, db?: DbContext) {
    const client = this.getClient(db);

    await client.classroom.update({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
