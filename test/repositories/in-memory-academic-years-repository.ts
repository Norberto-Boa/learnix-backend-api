import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import {
  AcademicYearsRepository,
  type SaveAcademicYearInput,
} from '../../src/academic-years/repositories/academic-years.repository';
import type { AcademicYear } from '@/generated/prisma/client';
import { randomUUID } from 'crypto';

export class InMemoryAcademicYearsRepository implements Partial<AcademicYearsRepository> {
  public items: AcademicYear[] = [];

  async save(
    {
      year,
      label,
      startDate,
      endDate,
      schoolId,
      isActive,
    }: SaveAcademicYearInput,
    tx: TransactionClient,
  ): Promise<AcademicYear> {
    const academicYear = {
      id: randomUUID(),
      year: year,
      label: label,
      startDate: startDate,
      endDate: endDate,
      schoolId: schoolId,
      isActive: isActive ?? false,
      isClosed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(academicYear);

    return academicYear;
  }

  async findById(id: string): Promise<AcademicYear | null> {
    const academicYear = this.items.find((item) => item.id === id);
    return academicYear ?? null;
  }

  async findByYear(
    year: number,
    schoolId: string,
  ): Promise<AcademicYear | null> {
    const academicYear = this.items.find(
      (item) => item.year === year && item.schoolId === schoolId,
    );
    return academicYear ?? null;
  }

  async deactivateAll(
    schoolId: string,
    tx: TransactionClient,
  ): Promise<{ count: number }> {
    let count = 0;

    this.items = this.items.map((item) => {
      if (item.schoolId === schoolId && item.isActive) {
        return { ...item, isActive: false };
      }
      return item;
    });

    return { count };
  }

  async activate(
    schoolId: string,
    id: string,
    tx: TransactionClient,
  ): Promise<AcademicYear> {
    const index = this.items.findIndex(
      (item) => item.id === id && item.schoolId === schoolId && !item.deletedAt,
    );

    if (index === -1) {
      throw new Error('Record to update not found');
    }

    this.items[index] = {
      ...this.items[index],
      isActive: true,
      updatedAt: new Date(),
    };

    return this.items[index];
  }
}
