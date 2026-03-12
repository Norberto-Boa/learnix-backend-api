import type {
  EnrollmentsRepository,
  GetManyEnrollmentsParams,
  SaveEnrollmentRepositoryData,
} from '../enrollments.repository';
import { Enrollment } from '../../domain/enrollment';
import { randomUUID } from 'crypto';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

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

  ACTIVE_ENROLLMENT_STATUSES: ENROLLMENT_STATUS[] = [
    ENROLLMENT_STATUS.PENDING,
    ENROLLMENT_STATUS.ACTIVE,
  ];

  async countActiveEnrollmentsByClassroom(
    classroomId: string,
    schoolId: string,
  ): Promise<{ count: number }> {
    const count = this.items.filter(
      (item) =>
        item.classroomId === classroomId &&
        item.schoolId === schoolId &&
        !item.deletedAt &&
        this.ACTIVE_ENROLLMENT_STATUSES.includes(item.status),
    ).length;

    return { count };
  }

  async findMany(
    params: GetManyEnrollmentsParams,
    schoolId: string,
  ): Promise<Enrollment[]> {
    return this.items
      .filter((item) => {
        if (item.schoolId !== schoolId) return false;
        if (!item.deletedAt) return false;
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
  }
}
