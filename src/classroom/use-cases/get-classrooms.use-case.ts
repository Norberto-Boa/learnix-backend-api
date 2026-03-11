import { Injectable } from '@nestjs/common';
import { ClassroomRepository } from '../repositories/classroom.repository';

interface GetClassroomUseCaseRequest {
  gradeId?: string;
  academicYearId?: string;
  search?: string;
}

@Injectable()
export class GetClassroomUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(
    { gradeId, academicYearId, search }: GetClassroomUseCaseRequest,
    schoolId: string,
  ) {
    const classrooms = await this.classroomRepository.findMany(
      {
        gradeId,
        academicYearId,
        search,
      },
      schoolId,
    );

    return classrooms;
  }
}
