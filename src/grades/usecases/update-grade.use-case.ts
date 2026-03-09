import { Injectable } from '@nestjs/common';
import { GradesRepository } from '../repositories/grades.repository';
import type { UpdateGradeDTO } from '../dto/update-grade.dto';
import { GradeNotFoundError } from '../errors/grade-not-found.error';
import { GradeAlreadyUsesThisNameError } from '../errors/grade-already-uses-this-name.error';

@Injectable()
export class UpdateGradeUseCase {
  constructor(private gradesRepository: GradesRepository) {}

  async execute(id: string, schoolId: string, data: UpdateGradeDTO) {
    const grade = await this.gradesRepository.findById(id, schoolId);

    if (!grade) {
      throw new GradeNotFoundError();
    }

    if (data.name) {
      const existing = await this.gradesRepository.findByName(
        data.name,
        schoolId,
      );

      if (existing && existing.id !== id) {
        throw new GradeAlreadyUsesThisNameError();
      }

      return this.gradesRepository.update(id, schoolId, data);
    }
  }
}
