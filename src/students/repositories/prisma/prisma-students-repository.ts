import { Injectable } from '@nestjs/common';
import type {
  CreateStudentsData,
  GetStudentsParams,
  StudentsRepository,
} from '../students.repository';
import { PrismaService } from '@/prisma/prisma.service';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { StudentDomain } from '@/students/domain/student';
import type { DbContext } from '@/prisma/shared/db-context';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async save(data: CreateStudentsData, db: DbContext): Promise<StudentDomain> {
    return db.student.create({
      data,
    });
  }

  async findById(
    id: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain | null> {
    const client = db ?? this.prisma;

    return client.student.findFirst({
      where: { id, schoolId, deletedAt: null },
    });
  }

  async findMany(
    { schoolId, page, limit, search, status }: GetStudentsParams,
    db?: DbContext,
  ): Promise<{ students: StudentDomain[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {
      schoolId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          registrationNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [students, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      students,
      total,
    };
  }

  async findByRegistrationNumber(
    registrationNumber: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain | null> {
    const client = db ?? this.prisma;

    return client.student.findFirst({
      where: { registrationNumber, schoolId, deletedAt: null },
    });
  }

  async findByName(
    name: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain[]> {
    const client = db ?? this.prisma;

    return client.student.findMany({
      where: {
        name: {
          contains: name,
        },
        schoolId,
        deletedAt: null,
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

  async softDelete(id: string, schoolId: string, db: DbContext): Promise<void> {
    await db.student.update({
      where: { id, schoolId },
      data: { deletedAt: new Date() },
    });
  }
}
