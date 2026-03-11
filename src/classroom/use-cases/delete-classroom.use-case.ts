import { Injectable } from '@nestjs/common';
import { ClassroomRepository } from '../repositories/classroom.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { ClassroomNotFoundError } from '../errors/classroom-not-found.error';

interface DeleteClassroomUseCaseRequest {
  id: string;
}

@Injectable()
export class DeleteClassroomUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(
    { id }: DeleteClassroomUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ) {
    const classroom = await this.classroomRepository.findById(id, schoolId);

    if (!classroom) {
      throw new ClassroomNotFoundError();
    }

    const deletedClassroom = await this.classroomRepository.delete(
      id,
      schoolId,
      db,
    );

    return deletedClassroom;
  }
}
