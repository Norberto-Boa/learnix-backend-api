import type { ClassroomDomain } from '@/classroom/domain/classroom';
import type {
  ClassroomRepository,
  CreateClassroomData,
  GetClassroomsParams,
  GetUniqueClassroomParams,
  UpdateClassroomData,
} from '../classroom.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { randomUUID } from 'crypto';

export class InMemoryClassroomRepository implements ClassroomRepository {
  items: ClassroomDomain[] = [];

  async save(
    data: CreateClassroomData,
    db?: DbContext,
  ): Promise<ClassroomDomain> {
    const classroom: ClassroomDomain = {
      id: randomUUID(),
      name: data.name,
      capacity: data.capacity,
      gradeId: data.gradeId,
      academicYearId: data.academicYearId,
      schoolId: data.schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(classroom);

    return classroom;
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<ClassroomDomain | null> {
    const classroom =
      this.items.find(
        (item) =>
          item.id === id &&
          item.schoolId === schoolId &&
          item.deletedAt === null,
      ) ?? null;

    return classroom;
  }

  async findByUniqueKeys(
    params: GetUniqueClassroomParams,
    schoolId: string,
  ): Promise<ClassroomDomain | null> {
    const classroom =
      this.items.find(
        (item) =>
          item.schoolId === schoolId &&
          item.name === params.name &&
          item.gradeId === params.gradeId &&
          item.academicYearId === params.academicYearId &&
          item.deletedAt === null,
      ) ?? null;

    return classroom;
  }

  async findMany(
    params: GetClassroomsParams,
    schoolId: string,
  ): Promise<ClassroomDomain[]> {
    const classrooms = this.items
      .filter((item) => item.schoolId === schoolId && !item.deletedAt)
      .filter((item) =>
        params.academicYearId
          ? item.academicYearId === params.academicYearId
          : true,
      )
      .filter((item) =>
        params.gradeId ? item.gradeId === params.gradeId : true,
      )
      .filter((item) =>
        params.search
          ? item.name.toLowerCase().includes(params.search.toLowerCase())
          : true,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return classrooms;
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateClassroomData,
  ): Promise<ClassroomDomain> {
    const classroomIndex = this.items.findIndex(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    const classroom = this.items[classroomIndex];

    const updatedClassroom: ClassroomDomain = {
      ...classroom,
      ...data,
      updatedAt: new Date(),
    };

    this.items[classroomIndex] = updatedClassroom;

    return updatedClassroom;
  }

  async delete(id: string, schoolId: string, db?: DbContext) {
    const classroomIndex = this.items.findIndex(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    const classroom = this.items[classroomIndex];

    const deletedClassroom: ClassroomDomain = {
      ...classroom,
      deletedAt: new Date(),
      updatedAt: new Date(),
    };

    this.items[classroomIndex] = deletedClassroom;

    return deletedClassroom;
  }
}
