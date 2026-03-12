import type { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import type { DbContext } from '@/prisma/shared/db-context';
import type { Enrollment } from '../domain/enrollment';

export interface SaveEnrollmentRepositoryData {
  studentId: string;
  classroomId: string;
  academicYearId: string;
  schoolId: string;
  status?: ENROLLMENT_STATUS;
}

export interface GetManyEnrollmentsParams {
  academicYearId?: string;
  classroomId?: string;
  studentId?: string;
  status?: ENROLLMENT_STATUS;
}

export abstract class EnrollmentsRepository {
  abstract save(
    data: SaveEnrollmentRepositoryData,
    db?: DbContext,
  ): Promise<Enrollment>;
  abstract findById(id: string, schoolId: string): Promise<Enrollment | null>;
  abstract findByStudentAndAcademicYear(
    studentId: string,
    academicYearId: string,
    schoolId: string,
  ): Promise<Enrollment | null>;

  abstract countActiveEnrollmentsByClassroom(
    classroomId: string,
    schoolId: string,
  ): Promise<{ count: number }>;

  abstract findMany(
    schoolId: string,
    params: GetManyEnrollmentsParams,
  ): Promise<Enrollment[]>;
}
