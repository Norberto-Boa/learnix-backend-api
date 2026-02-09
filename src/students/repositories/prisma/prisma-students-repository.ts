import { Injectable } from '@nestjs/common';
import type {
  CreateStudentsData,
  StudentsRepository,
} from '../students.repository';
import { PrismaService } from '@/prisma/prisma.service';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { StudentDomain } from '@/students/domain/student';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async save(
    data: CreateStudentsData,
    tx?: TransactionClient,
  ): Promise<StudentDomain> {
    const client = tx ?? this.prisma;

    return client.student.create({
      data,
    });
  }

  async findById(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain | null> {
    const client = tx ?? this.prisma;

    return client.student.findFirst({
      where: { id, schoolId },
    });
  }

  async findByRegistrationNumber(
    registrationNumber: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain | null> {
    const client = tx ?? this.prisma;

    return client.student.findFirst({
      where: { registrationNumber, schoolId },
    });
  }

  async findByName(
    name: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain[]> {
    const client = tx ?? this.prisma;

    return client.student.findMany({
      where: {
        name: {
          contains: name,
        },
        schoolId,
      },
    });
  }

  async findByAge(
    age: number,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDomain[]> {
    return [];
  }

  async softDelete(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.student.update({
      where: { id, schoolId },
      data: { deletedAt: new Date() },
    });
  }
}
