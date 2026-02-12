import type { StudentDomain } from '@/students/domain/student';
import type {
  CreateStudentsData,
  StudentsRepository,
} from '../students.repository';
import { randomUUID } from 'crypto';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { Student } from '@/generated/prisma/client';

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: StudentDomain[] = [];

  async save(data: CreateStudentsData): Promise<StudentDomain> {
    const student: StudentDomain = {
      id: randomUUID(),
      name: data.name,
      registrationNumber: data.registrationNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      schoolId: data.schoolId,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(student);
    return student;
  }

  async findMany(
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain[]> {
    const students = this.items.filter((item) => item.schoolId === schoolId);

    return students;
  }

  async findById(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain | null> {
    return (
      this.items.find((item) => item.id === id && item.schoolId === schoolId) ??
      null
    );
  }

  async findByRegistrationNumber(
    registrationNumber: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain | null> {
    return (
      this.items.find(
        (item) =>
          item.registrationNumber === registrationNumber &&
          item.schoolId === schoolId,
      ) ?? null
    );
  }

  async findByName(
    name: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain[]> {
    return this.items.filter(
      (item) => item.name.includes(name) && item.schoolId === schoolId,
    );
  }

  async findByAge(
    age: number,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain[]> {
    const birthYear = new Date().getFullYear() - age;
    const students = this.items.filter(
      (item) =>
        item.dateOfBirth.getFullYear() === birthYear &&
        item.schoolId === schoolId,
    );

    return students;
  }

  async softDelete(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<void> {
    const student = this.items.find(
      (item) => item.id === id && item.schoolId === schoolId,
    );

    if (student && !student.deletedAt) {
      student.deletedAt = new Date();
    }
  }
}
