import type { DbContext } from '@/prisma/shared/db-context';
import type { GradeDomainProps } from '../domain/grade';

export interface CreateGradeData {
  name: string;
  order: number;
  schoolId: string;
}

export interface UpdateGradeData {
  name?: string;
  order?: number;
}

export interface GetGradesParams {
  schoolId: string;
  page: number;
  limit: number;
  search?: string;
}

export abstract class GradesRepository {
  abstract save(
    data: CreateGradeData,
    db?: DbContext,
  ): Promise<GradeDomainProps>;

  abstract findMany(
    params: GetGradesParams,
  ): Promise<{ grades: GradeDomainProps[]; total: number }>;

  abstract findById(
    id: string,
    schoolId: string,
  ): Promise<GradeDomainProps | null>;

  abstract findByName(
    name: string,
    schoolId: string,
  ): Promise<GradeDomainProps | null>;

  abstract update(
    id: string,
    schoolId: string,
    data: UpdateGradeData,
    db?: DbContext,
  ): Promise<GradeDomainProps>;

  abstract softDelete(
    id: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<void>;
}
