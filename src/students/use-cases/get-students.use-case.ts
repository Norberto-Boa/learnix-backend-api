import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository';
import { DbContext } from '../../prisma/shared/db-context';
import { GetStudentsDTO } from '../dto/get-students.dto';

@Injectable()
export class GetStudentsUseCase {
  constructor(private studentsRepostory: StudentsRepository) {}

  async execute(query: GetStudentsDTO, schoolId: string, db?: DbContext) {
    const { page, limit, search, status } = query;

    const result = await this.studentsRepostory.findMany(
      {
        schoolId,
        page,
        limit,
        search,
        status,
      },
      db,
    );

    return {
      ...result,
      page,
      limit,
    };
  }
}
