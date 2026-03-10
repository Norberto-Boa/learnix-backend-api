import { Injectable } from '@nestjs/common';
import {
  type CreateGradeData,
  GradesRepository,
} from '../repositories/grades.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { GradeAlreadyExistsError } from '../errors/grade-already-exists.error';

@Injectable()
export class CreateGradeUseCase {
  constructor(private gradesRepository: GradesRepository) {}

  async execute(data: CreateGradeData, db?: DbContext) {
    const existing = await this.gradesRepository.findByName(
      data.name,
      data.schoolId,
    );

    if (existing) {
      throw new GradeAlreadyExistsError();
    }

    const grade = await this.gradesRepository.save(
      {
        ...data,
      },
      db,
    );

    return grade;
  }
}
