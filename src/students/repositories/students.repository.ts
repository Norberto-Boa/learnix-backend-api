import type { Student } from '@/generated/prisma/client';
import type { GENDER, STUDENT_STATUS } from '@/generated/prisma/enums';
import type { DbContext } from '@/prisma/shared/db-context';
import { StudentDomain } from '../domain/student';

export interface CreateStudentsData {
  name: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: GENDER;
  schoolId: string;
}

export interface GetStudentsParams {
  schoolId: string;
  page: number;
  limit: number;
  search?: string;
  status?: STUDENT_STATUS;
}

export abstract class StudentsRepository {
  abstract save(
    data: CreateStudentsData,
    db?: DbContext,
  ): Promise<StudentDomain>;
  abstract findMany(
    params: GetStudentsParams,
    db?: DbContext,
  ): Promise<{ data: StudentDomain[]; total: number }>;
  abstract findById(
    id: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain | null>;
  abstract findByRegistrationNumber(
    registrationNumber: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain | null>;
  abstract findByName(
    name: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain[]>;
  abstract findByAge(
    age: number,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain[]>;
  abstract softDelete(
    id: string,
    schoolId: string,
    db: DbContext,
  ): Promise<void>;
}
