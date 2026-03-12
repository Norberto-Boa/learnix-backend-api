import type {
  EnrollmentsRepository,
  GetManyEnrollmentsParams,
  SaveEnrollmentRepositoryData,
} from '../enrollments.repository';
import {
  Enrollment,
  ACTIVE_ENROLLMENT_STATUSES,
} from '../../domain/enrollment';
import { randomUUID } from 'crypto';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import type { DbContext } from '@/prisma/shared/db-context';
import { EnrollmentNotFoundError } from '@/enrollments/errors/enrollment-not-found.error';

export class InMemoryEnrollmentsRepository implements EnrollmentsRepository {
  public items: Enrollment[] = [];

  async save(data: SaveEnrollmentRepositoryData) {
    const enrollment: Enrollment = {
      id: randomUUID(),
      studentId: data.studentId,
      classroomId: data.classroomId,
      academicYearId: data.academicYearId,
      schoolId: data.schoolId,
      status: data.status ?? ENROLLMENT_STATUS.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(enrollment);

    return enrollment;
  }

  async findById(id: string, schoolId: string): Promise<Enrollment | null> {
    return (
      this.items.find(
        (item) =>
          item.id === id && item.schoolId === schoolId && !item.deletedAt,
      ) ?? null
    );
  }

  async findByStudentAndAcademicYear(
    studentId: string,
    academicYearId: string,
    schoolId: string,
  ): Promise<Enrollment | null> {
    return (
      this.items.find(
        (item) =>
          item.studentId === studentId &&
          item.academicYearId === academicYearId &&
          item.schoolId === schoolId &&
          !item.deletedAt,
      ) ?? null
    );
  }

  async countActiveEnrollmentsByClassroom(
    classroomId: string,
    schoolId: string,
  ): Promise<{ count: number }> {
    const count = this.items.filter(
      (item) =>
        item.classroomId === classroomId &&
        item.schoolId === schoolId &&
        !item.deletedAt &&
        ACTIVE_ENROLLMENT_STATUSES.includes(item.status),
    ).length;

    return { count };
  }

  async findMany(
    schoolId: string,
    params: GetManyEnrollmentsParams,
  ): Promise<Enrollment[]> {
    const enrollment = this.items
      .filter((item) => {
        if (item.schoolId !== schoolId) return false;
        if (item.deletedAt !== null) return false;
        if (
          params.academicYearId &&
          item.academicYearId !== params.academicYearId
        )
          return false;
        if (params.classroomId && item.classroomId !== params.classroomId)
          return false;
        if (params.studentId && item.studentId !== params.studentId)
          return false;
        if (params.status && item.status !== params.status) return false;

        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return enrollment;
  }

  async updateStatus(
    id: string,
    schoolId: string,
    status: ENROLLMENT_STATUS,
    db: DbContext,
  ): Promise<Enrollment> {
    const enrollmentIndex = this.items.findIndex(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    if (enrollmentIndex < 0) {
      throw new EnrollmentNotFoundError();
    }

    this.items[enrollmentIndex] = {
      ...this.items[enrollmentIndex],
      status,
      updatedAt: new Date(),
    };

    return this.items[enrollmentIndex];
  }
}
