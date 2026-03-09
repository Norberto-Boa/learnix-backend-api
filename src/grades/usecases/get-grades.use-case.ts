import { Injectable } from '@nestjs/common';
import { GradesRepository } from '../repositories/grades.repository';
import type { GetGradesDTO } from '../dto/get-grades.dto';

@Injectable()
export class GetGradesUseCase {
  constructor(private gradesRepository: GradesRepository) {}

  async execute(query: GetGradesDTO, schoolId: string) {
    const { page, limit, search } = query;

    const result = await this.gradesRepository.findMany({
      limit,
      page,
      schoolId,
      search,
    });

    return {
      ...result,
      page,
      limit,
    };
  }
}
