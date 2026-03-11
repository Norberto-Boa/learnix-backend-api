import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomRepository } from '../repositories/classroom.repository';
import { GradesRepository } from '@/grades/repositories/grades.repository';
import { AcademicYearsRepository } from '../../academic-years/repositories/academic-years.repository';
import { GradeNotFoundError } from '@/grades/errors/grade-not-found.error';
import { ClassroomAlreadyExistsError } from '../errors/classroom-already-exists.error';
import type { DbContext } from '@/prisma/shared/db-context';

interface CreateClassroomUseCaseRequest {
  name: string;
  capacity: number;
  gradeId: string;
  academicYearId: string;
  schoolId: string;
}

@Injectable()
export class CreateClassroomUseCase {
  constructor(
    private classroomRepository: ClassroomRepository,
    private gradeRepository: GradesRepository,
    private academicYearRepository: AcademicYearsRepository,
  ) {}

  async execute(data: CreateClassroomUseCaseRequest, db?: DbContext) {
    const grade = await this.gradeRepository.findById(
      data.gradeId,
      data.schoolId,
    );

    if (!grade) {
      throw new GradeNotFoundError();
    }

    const academicYear = await this.academicYearRepository.findById(
      data.academicYearId,
      data.schoolId,
    );

    if (!academicYear) {
      throw new NotFoundException('Ano academico nao encotrado!');
    }

    const existingClassroom = await this.classroomRepository.findByUniqueKeys(
      {
        name: data.name,
        gradeId: data.gradeId,
        academicYearId: data.academicYearId,
      },
      data.schoolId,
    );

    if (existingClassroom) {
      throw new ClassroomAlreadyExistsError();
    }

    const classroom = await this.classroomRepository.save(
      {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        academicYearId: data.academicYearId,
        schoolId: data.schoolId,
      },
      db,
    );

    return classroom;
  }
}
