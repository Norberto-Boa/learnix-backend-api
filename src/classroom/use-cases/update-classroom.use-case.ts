import { Injectable } from '@nestjs/common';
import type { ClassroomRepository } from '../repositories/classroom.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { ClassroomNotFoundError } from '../errors/classroom-not-found.error';
import { ClassroomAlreadyExistsError } from '../errors/classroom-already-exists.error';

interface UpdateClassroomUseCaseRequest {
  id: string;
  name?: string;
  capacity?: number;
}

@Injectable()
export class UpdateClassroomUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(
    { id, name, capacity }: UpdateClassroomUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ) {
    const classroom = await this.classroomRepository.findById(id, schoolId);

    if (!classroom) {
      throw new ClassroomNotFoundError();
    }

    if (name && name !== classroom.name) {
      const existingClassroom = await this.classroomRepository.findByUniqueKeys(
        {
          name,
          academicYearId: classroom.academicYearId,
          gradeId: classroom.gradeId,
        },
        schoolId,
      );

      if (existingClassroom && existingClassroom.id !== classroom.id) {
        throw new ClassroomAlreadyExistsError();
      }
    }

    const updatedClassroom = await this.classroomRepository.update(
      id,
      schoolId,
      {
        name,
        capacity,
      },
      db,
    );

    return updatedClassroom;
  }
}
