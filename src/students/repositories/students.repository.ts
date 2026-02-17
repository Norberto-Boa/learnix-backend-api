import type { Student } from '@/generated/prisma/client';
import type { GENDER } from '@/generated/prisma/enums';
import type { StudentDomain } from '../domain/student';
import type { DbContext } from '@/prisma/shared/db-context';

export interface CreateStudentsData {
  name: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: GENDER;
  schoolId: string;
}

export abstract class StudentsRepository {
  abstract save(
    data: CreateStudentsData,
    db?: DbContext,
  ): Promise<StudentDomain>;
  abstract findMany(schoolId: string, db?: DbContext): Promise<StudentDomain[]>;
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
