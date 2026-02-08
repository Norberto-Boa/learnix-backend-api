import type { Student } from '@/generated/prisma/client';
import type { GENDER } from '@/generated/prisma/enums';

export interface CreateStudentsData {
  name: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: GENDER;
  schoolId: string;
}

export abstract class studentsRepository {
  abstract save(data: CreateStudentsData): Promise<Student>;
  abstract findById(id: string, schoolId: string): Promise<Student | null>;
  abstract findByRegistrationNumber(
    registrationNumber: string,
    schoolId: string,
  ): Promise<Student | null>;
  abstract findByName(name: string, schoolId: string): Promise<Student[]>;
  abstract findByAge(age: number, schoolId: string): Promise<Student[]>;
  abstract softDelete(id: string, schoolId: string): Promise<void>;
}
