import type { DbContext } from '@/prisma/shared/db-context';
import type { ClassroomDomain } from '../domain/classroom';

export interface GetClassroomsParams {
  academicYearId?: string;
  gradeId?: string;
  search?: string;
}

export interface GetUniqueClassroomParams {
  name: string;
  gradeId: string;
  academicYearId: string;
}

export interface CreateClassroomData {
  name: string;
  capacity: number;
  gradeId: string;
  academicYearId: string;
  schoolId: string;
}

export interface UpdateClassroomData {
  name?: string;
  capacity?: number;
  gradeId?: string;
  academicYearId?: string;
}

export abstract class ClassroomRepository {
  abstract create(
    data: CreateClassroomData,
    db?: DbContext,
  ): Promise<ClassroomDomain>;
  abstract findById(id: string, schoolId: string): Promise<ClassroomDomain>;
  abstract findByUniqueKeys(
    params: GetUniqueClassroomParams,
    schoolId: string,
  ): Promise<ClassroomDomain | null>;
  abstract findMany(params: GetClassroomsParams, schoolId: string);
  abstract update(
    id: string,
    schoolId: string,
    data: UpdateClassroomData,
    db?: DbContext,
  );
  abstract delete(id: string, schoolId: string, db?: DbContext);
}
