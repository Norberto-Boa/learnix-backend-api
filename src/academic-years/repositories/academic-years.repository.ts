import type { DbContext } from '@/prisma/shared/db-context';
import type { AcademicYearDomain } from '../domain/academic-year';

export interface SaveAcademicYearData {
  year: number;
  label: string;
  startDate: Date;
  endDate: Date;
  schoolId: string;
  isActive?: boolean;
  isClosed?: boolean;
}

export abstract class AcademicYearsRepository {
  abstract save(
    data: SaveAcademicYearData,
    db?: DbContext,
  ): Promise<AcademicYearDomain>;
  abstract findById(
    id: string,
    schoolId: string,
  ): Promise<AcademicYearDomain | null>;
  abstract findByYear(
    year: number,
    schoolId: string,
  ): Promise<AcademicYearDomain | null>;
  abstract deactivateAll(schoolId: string, db?: DbContext): Promise<void>;
  abstract activate(
    schoolId: string,
    id: string,
    db?: DbContext,
  ): Promise<AcademicYearDomain>;
  abstract deactivate(
    schoolId: string,
    id: string,
    db?: DbContext,
  ): Promise<AcademicYearDomain>;
}
