import type { GradeDomainProps } from '@/grades/domain/grade';
import type {
  CreateGradeData,
  GetGradesParams,
  GradesRepository,
  UpdateGradeData,
} from '../grades.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { randomUUID } from 'crypto';

export class InMemoryGradesRepository implements GradesRepository {
  public grades: GradeDomainProps[] = [];

  async save(
    data: CreateGradeData,
    _db?: DbContext,
  ): Promise<GradeDomainProps> {
    const grade: GradeDomainProps = {
      id: randomUUID(),
      name: data.name,
      order: data.order,
      schoolId: data.schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.grades.push(grade);

    return grade;
  }

  async findMany(
    params: GetGradesParams,
  ): Promise<{ grades: GradeDomainProps[]; total: number }> {
    const { schoolId, page, limit, search } = params;

    let grades = this.grades.filter(
      (g) => g.schoolId === schoolId && !g.deletedAt,
    );

    if (search) {
      grades = grades.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    grades = grades.sort((a, b) => a.order - b.order);

    const total = grades.length;

    const paginated = grades.slice((page - 1) * limit, page * limit);

    return {
      grades: paginated,
      total,
    };
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<GradeDomainProps | null> {
    return (
      this.grades.find(
        (g) => g.id === id && g.schoolId === schoolId && !g.deletedAt,
      ) ?? null
    );
  }

  async findByName(
    name: string,
    schoolId: string,
  ): Promise<GradeDomainProps | null> {
    return (
      this.grades.find(
        (g) =>
          g.name.toLowerCase() == name.toLowerCase() &&
          g.schoolId === schoolId &&
          !g.deletedAt,
      ) ?? null
    );
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateGradeData,
    db?: DbContext,
  ): Promise<GradeDomainProps> {
    const index = this.grades.findIndex(
      (g) => g.id && g.schoolId === schoolId && !g.deletedAt,
    );

    const grade = this.grades[index];

    const updated: GradeDomainProps = {
      id: grade.id,
      name: data.name ?? grade.name,
      order: data.order ?? grade.order,
      schoolId: grade.schoolId,
      createdAt: grade.createdAt,
      updatedAt: new Date(),
      deletedAt: grade.deletedAt,
    };

    this.grades[index] = updated;

    return updated;
  }

  async softDelete(
    id: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<void> {
    const index = this.grades.findIndex((g) => g.id && g.schoolId === schoolId);

    const grade = this.grades[index];

    if (grade && !grade.deletedAt) {
      grade.deletedAt = new Date();
    }
  }
}
