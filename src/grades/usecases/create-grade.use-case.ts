import { ConflictException, Injectable } from '@nestjs/common';
import type {
  CreateGradeData,
  GradesRepository,
} from '../repositories/grades.repository';
import type { DbContext } from '@/prisma/shared/db-context';

@Injectable()
export class CreateGradeUseCase {
  constructor(private gradesRepository: GradesRepository) {}

  async execute(schoolId: string, data: CreateGradeData, db?: DbContext) {
    const existing = await this.gradesRepository.findByName(
      data.name,
      schoolId,
    );

    if (existing) {
      throw new ConflictException(
        'A grade with this name already exists in your school',
      );
    }

    const grade = await this.gradesRepository.save(
      {
        ...data,
        schoolId,
      },
      db,
    );

    return grade;
  }
}
