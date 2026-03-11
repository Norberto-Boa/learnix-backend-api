import { Injectable } from '@nestjs/common';
import { ClassroomRepository } from '../repositories/classroom.repository';
import { ClassroomNotFoundError } from '../errors/classroom-not-found.error';

@Injectable()
export class GetClassroomByIdUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(id: string, schoolId: string) {
    const classroom = await this.classroomRepository.findById(id, schoolId);

    if (!classroom) {
      throw new ClassroomNotFoundError();
    }

    return classroom;
  }
}
