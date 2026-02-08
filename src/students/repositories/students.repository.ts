import type { Student } from '@/generated/prisma/client';
import type { GENDER } from '@/generated/prisma/enums';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { StudentDomain } from '../domain/student';

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
    tx?: TransactionClient,
  ): Promise<StudentDomain>;
  abstract findById(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain | null>;
  abstract findByRegistrationNumber(
    registrationNumber: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<Student | null>;
  abstract findByName(
    name: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain[]>;
  abstract findByAge(
    age: number,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain[]>;
  abstract softDelete(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<void>;
}
