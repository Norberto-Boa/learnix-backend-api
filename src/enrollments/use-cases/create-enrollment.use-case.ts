import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EnrollmentsRepository } from '../repositories/enrollments.repository';
import { StudentsRepository } from '../../students/repositories/students.repository';
import { ClassroomRepository } from '../../classroom/repositories/classroom.repository';
import type { AcademicYearsRepository } from '@/academic-years/repositories/academic-years.repository';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import { StudentNotFoundError } from '@/students/errors/student-not-found.error';
import { ClassroomNotFoundError } from '@/classroom/errors/classroom-not-found.error';
import type { DbContext } from '@/prisma/shared/db-context';

interface CreateEnrollmentUseCaseRequest {
  studentId: string;
  classroomId: string;
  academicYearId: string;
  schoolId: string;
  status?: ENROLLMENT_STATUS;
}

@Injectable()
export class CreateEnrollmentUseCase {
  constructor(
    private enrollmentsRepository: EnrollmentsRepository,
    private studentsRepository: StudentsRepository,
    private classroomsRepository: ClassroomRepository,
    private academicYearsRepository: AcademicYearsRepository,
  ) {}
  async execute(
    {
      academicYearId,
      classroomId,
      schoolId,
      studentId,
      status,
    }: CreateEnrollmentUseCaseRequest,
    db?: DbContext,
  ) {
    const student = await this.studentsRepository.findById(studentId, schoolId);

    if (!student) {
      throw new StudentNotFoundError();
    }

    const classroom = await this.classroomsRepository.findById(
      classroomId,
      schoolId,
    );

    if (!classroom) {
      throw new ClassroomNotFoundError();
    }

    const academicYear = await this.academicYearsRepository.findById(
      academicYearId,
      schoolId,
    );

    if (!academicYear) {
      throw new NotFoundException('Ano Lectivo nao encontrado!');
    }

    if (classroom.academicYearId !== academicYearId) {
      throw new Error();
    }

    if (academicYear.isClosed === true) {
      throw new Error();
    }

    const existingEnrollment =
      await this.enrollmentsRepository.findByStudentAndAcademicYear(
        studentId,
        academicYearId,
        schoolId,
      );

    if (existingEnrollment) {
      throw new ConflictException(
        'Student already has an active enrollment in this academic year',
      );
    }

    const activeEnrollments =
      await this.enrollmentsRepository.countActiveEnrollmentsByClassroom(
        classroomId,
        schoolId,
      );

    if (activeEnrollments.count >= classroom.capacity) {
      throw new ConflictException('A turma ja esta cheia!');
    }

    return this.enrollmentsRepository.save(
      {
        studentId,
        classroomId,
        academicYearId,
        status: status ?? ENROLLMENT_STATUS.ACTIVE,
        schoolId,
      },
      db,
    );
  }
}
