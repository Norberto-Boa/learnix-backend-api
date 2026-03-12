import { Injectable } from '@nestjs/common';
import type {
  EnrollmentsRepository,
  GetManyEnrollmentsParams,
  SaveEnrollmentRepositoryData,
} from '../enrollments.repository';
import { PrismaService } from '@/prisma/prisma.service';
import type { DbContext } from '@/prisma/shared/db-context';
import {
  ACTIVE_ENROLLMENT_STATUSES,
  type Enrollment,
} from '@/enrollments/domain/enrollment';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

@Injectable()
export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getClient(db?: DbContext) {
    return db ?? this.prisma;
  }

  async save(data: SaveEnrollmentRepositoryData, db?: DbContext) {
    const client = this.getClient(db);

    return await client.enrollment.create({
      data,
    });
  }

  async findById(id: string, schoolId: string): Promise<Enrollment | null> {
    return await this.prisma.enrollment.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
      include: {
        student: true,
        classroom: true,
        academicYear: true,
      },
    });
  }

  async findByStudentAndAcademicYear(
    studentId: string,
    academicYearId: string,
    schoolId: string,
  ): Promise<Enrollment | null> {
    return await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        academicYearId,
        schoolId,
        deletedAt: null,
        status: {
          in: ACTIVE_ENROLLMENT_STATUSES,
        },
      },
    });
  }

  async countActiveEnrollmentsByClassroom(
    classroomId: string,
    schoolId: string,
  ): Promise<{ count: number }> {
    const count = await this.prisma.enrollment.count({
      where: {
        classroomId,
        schoolId,
        deletedAt: null,
        status: {
          in: [ENROLLMENT_STATUS.ACTIVE],
        },
      },
    });

    return { count };
  }

  async findMany(
    schoolId: string,
    params: GetManyEnrollmentsParams,
  ): Promise<Enrollment[]> {
    return await this.prisma.enrollment.findMany({
      where: {
        schoolId,
        deletedAt: null,
        academicYearId: params.academicYearId,
        classroomId: params.classroomId,
        studentId: params.studentId,
        status: params.status,
      },
      include: {
        student: true,
        classroom: true,
        academicYear: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(
    id: string,
    schoolId: string,
    status: ENROLLMENT_STATUS,
    db: DbContext,
  ): Promise<Enrollment> {
    const client = this.getClient(db);

    return client.enrollment.update({
      where: {
        id,
        schoolId,
      },
      data: {
        status,
      },
    });
  }
}
