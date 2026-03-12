import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import {
  type SaveAcademicYearData,
  AcademicYearsRepository,
} from '@/academic-years/repositories/academic-years.repository';
import type { AcademicYear } from '@/generated/prisma/client';
import { randomUUID } from 'crypto';
import type { AcademicYearDomain } from '@/academic-years/domain/academic-year';

export class InMemoryAcademicYearsRepository implements AcademicYearsRepository {
  public items: AcademicYearDomain[] = [];

  async save({
    year,
    label,
    startDate,
    endDate,
    schoolId,
    isActive,
    isClosed,
  }: SaveAcademicYearData) {
    const academicYear = {
      id: randomUUID(),
      year: year,
      label: label,
      startDate: startDate,
      endDate: endDate,
      schoolId: schoolId,
      isActive: isActive ?? false,
      isClosed: isClosed ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(academicYear);

    return academicYear;
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<AcademicYearDomain | null> {
    const academicYear = this.items.find(
      (item) => item.id === id && item.schoolId === schoolId,
    );
    return academicYear ?? null;
  }

  async findByYear(
    year: number,
    schoolId: string,
  ): Promise<AcademicYear | null> {
    const academicYear =
      this.items.find(
        (item) => item.year === year && item.schoolId === schoolId,
      ) ?? null;
    return academicYear;
  }

  async deactivateAll(schoolId: string, tx: TransactionClient): Promise<void> {
    this.items = this.items.map((item) => {
      if (item.schoolId === schoolId && item.isActive) {
        return { ...item, isActive: false };
      }
      return item;
    });
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

  async deactivate(
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
      isActive: false,
      updatedAt: new Date(),
    };
    return this.items[index];
  }
}
