import { InMemoryStudentsRepository } from '@/students/repositories/in-memory/in-memory-students.repository';
import { InMemoryEnrollmentsRepository } from '../repositories/in-memory/in-memory-enrollments.repository';
import { InMemoryClassroomRepository } from '@/classroom/repositories/in-memory/in-memory-classroom.repository';
import { InMemoryAcademicYearsRepository } from '@/academic-years/repositories/in-memory/in-memory-academic-years-repository';
import { CreateEnrollmentUseCase } from '../use-cases/create-enrollment.use-case';
import { studentFactory } from '@test/factories/student.factory';
import { classroomFactory } from '@test/factories/classroom.factory';
import { academicYearFactory } from '@test/factories/academicYear.factory';
import { StudentNotFoundError } from '@/students/errors/student-not-found.error';
import { AcademicYearAndClassroomYearDoNotMatchFoundError } from '../errors/academic-year-and-classroom-year-do-not-match.error';
import { ConflictException } from '@nestjs/common';
import { AcademicYearClosedError } from '../errors/academic-year-closed.error';

describe('CreateEnrollmentUseCase', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let classroomRepository: InMemoryClassroomRepository;
  let academicYearRepository: InMemoryAcademicYearsRepository;
  let sut: CreateEnrollmentUseCase;

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    classroomRepository = new InMemoryClassroomRepository();
    academicYearRepository = new InMemoryAcademicYearsRepository();

    sut = new CreateEnrollmentUseCase(
      enrollmentsRepository,
      studentsRepository,
      classroomRepository,
      academicYearRepository,
    );
  });

  it('Should create an enrollment', async () => {
    const student = await studentsRepository.save(
      studentFactory({ schoolId: 'school-id' }),
    );
    const academicYear = await academicYearRepository.save(
      academicYearFactory({ schoolId: 'school-id' }),
    );
    const classroom = await classroomRepository.save(
      classroomFactory({
        schoolId: 'school-id',
        academicYearId: academicYear.id,
      }),
    );

    const result = await sut.execute({
      studentId: student.id,
      classroomId: classroom.id,
      academicYearId: academicYear.id,
      schoolId: 'school-id',
    });

    expect(result).toEqual(
      expect.objectContaining({
        studentId: student.id,
        classroomId: classroom.id,
        academicYearId: academicYear.id,
        schoolId: 'school-id',
      }),
    );
  });

  it('Should not create enrollment when student does not exist', async () => {
    const academicYear = await academicYearRepository.save(
      academicYearFactory({ schoolId: 'school-id' }),
    );
    const classroom = await classroomRepository.save(
      classroomFactory({
        schoolId: 'school-id',
        academicYearId: academicYear.id,
      }),
    );

    await expect(
      sut.execute({
        studentId: 'student-1',
        classroomId: classroom.id,
        academicYearId: academicYear.id,
        schoolId: 'school-id',
      }),
    ).rejects.toBeInstanceOf(StudentNotFoundError);
  });

  it('Should not create enrollment when classroom academicYear does not match', async () => {
    const student = await studentsRepository.save(
      studentFactory({ schoolId: 'school-id' }),
    );
    const academicYear = await academicYearRepository.save(
      academicYearFactory({ schoolId: 'school-id' }),
    );
    const classroom = await classroomRepository.save(
      classroomFactory({
        schoolId: 'school-id',
      }),
    );

    await expect(
      sut.execute({
        studentId: student.id,
        classroomId: classroom.id,
        academicYearId: academicYear.id,
        schoolId: 'school-id',
      }),
    ).rejects.toBeInstanceOf(AcademicYearAndClassroomYearDoNotMatchFoundError);
  });

  it('Should not create enrollment when student already has active enrollment in same academic year', async () => {
    const student = await studentsRepository.save(
      studentFactory({ schoolId: 'school-id' }),
    );

    const academicYear = await academicYearRepository.save(
      academicYearFactory({ schoolId: 'school-id' }),
    );
    const classroom = await classroomRepository.save(
      classroomFactory({
        schoolId: 'school-id',
        academicYearId: academicYear.id,
      }),
    );

    await sut.execute({
      studentId: student.id,
      classroomId: classroom.id,
      academicYearId: academicYear.id,
      schoolId: 'school-id',
    });

    await expect(
      sut.execute({
        studentId: student.id,
        classroomId: classroom.id,
        academicYearId: academicYear.id,
        schoolId: 'school-id',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('Should not create enrollment when classroom capacity is reached', async () => {
    const student = await studentsRepository.save(
      studentFactory({ schoolId: 'school-id' }),
    );
    const academicYear = await academicYearRepository.save(
      academicYearFactory({ schoolId: 'school-id' }),
    );
    const classroom = await classroomRepository.save(
      classroomFactory({
        schoolId: 'school-id',
        academicYearId: academicYear.id,
        capacity: 1,
      }),
    );

    await sut.execute({
      studentId: student.id,
      classroomId: classroom.id,
      academicYearId: academicYear.id,
      schoolId: 'school-id',
    });

    await expect(
      sut.execute({
        studentId: student.id,
        classroomId: classroom.id,
        academicYearId: academicYear.id,
        schoolId: 'school-id',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('Should not create enrollment when academic year is closed', async () => {
    const student = await studentsRepository.save(
      studentFactory({ schoolId: 'school-id' }),
    );
    const academicYear = await academicYearRepository.save(
      academicYearFactory({ schoolId: 'school-id', isClosed: true }),
    );
    const classroom = await classroomRepository.save(
      classroomFactory({
        schoolId: 'school-id',
        academicYearId: academicYear.id,
      }),
    );

    await expect(
      sut.execute({
        studentId: student.id,
        classroomId: classroom.id,
        academicYearId: academicYear.id,
        schoolId: 'school-id',
      }),
    ).rejects.toBeInstanceOf(AcademicYearClosedError);
  });
});
