import { InMemoryGradesRepository } from '@/grades/repositories/in-memory/in-memory-students.repository';
import { InMemoryClassroomRepository } from '../repositories/in-memory/in-memory-classroom.repository';
import { InMemoryAcademicYearsRepository } from '@/academic-years/repositories/in-memory/in-memory-academic-years-repository';
import { CreateClassroomUseCase } from '../use-cases/create-classroom.use-case';
import { ClassroomAlreadyExistsError } from '../errors/classroom-already-exists.error';
import { GradeNotFoundError } from '@/grades/errors/grade-not-found.error';
import { NotFoundException } from '@nestjs/common';

let classroomRepository: InMemoryClassroomRepository;
let gradeRepository: InMemoryGradesRepository;
let academicYearRepository: InMemoryAcademicYearsRepository;
let sut: CreateClassroomUseCase;

describe('Create Classroom Use Case', () => {
  beforeEach(() => {
    classroomRepository = new InMemoryClassroomRepository();
    gradeRepository = new InMemoryGradesRepository();
    academicYearRepository = new InMemoryAcademicYearsRepository();

    sut = new CreateClassroomUseCase(
      classroomRepository,
      gradeRepository,
      academicYearRepository,
    );
  });

  it('Should be able to create a classroom', async () => {
    const schoolId = 'school-1';

    const grade = await gradeRepository.save({
      name: 'Grade 1',
      order: 1,
      schoolId,
    });

    const academicYear = await academicYearRepository.save({
      label: '2026',
      year: 2026,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      schoolId,
    });

    const result = await sut.execute({
      name: 'A',
      capacity: 30,
      gradeId: grade.id,
      academicYearId: academicYear.id,
      schoolId,
    });

    expect(result.id).toEqual(expect.any(String));
  });

  it('Should not be able to create a duplicate classroom', async () => {
    const schoolId = 'school-1';

    const grade = await gradeRepository.save({
      name: 'Grade 1',
      order: 1,
      schoolId,
    });

    const academicYear = await academicYearRepository.save({
      label: '2026',
      year: 2026,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      schoolId,
    });

    await sut.execute({
      name: 'A',
      capacity: 30,
      gradeId: grade.id,
      academicYearId: academicYear.id,
      schoolId,
    });

    await expect(() =>
      sut.execute({
        name: 'A',
        capacity: 30,
        gradeId: grade.id,
        academicYearId: academicYear.id,
        schoolId,
      }),
    ).rejects.toBeInstanceOf(ClassroomAlreadyExistsError);
  });

  it('Should not be able to create a classroom with non-existing grade', async () => {
    const schoolId = 'school-1';

    const academicYear = await academicYearRepository.save({
      label: '2026',
      year: 2026,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      schoolId,
    });

    await expect(() =>
      sut.execute({
        name: 'A',
        capacity: 30,
        gradeId: 'non-existing-grade-id',
        academicYearId: academicYear.id,
        schoolId,
      }),
    ).rejects.toBeInstanceOf(GradeNotFoundError);
  });

  it('Should not be able to create a non-existing academic year', async () => {
    const schoolId = 'school-1';

    const grade = await gradeRepository.save({
      name: 'Grade 1',
      order: 1,
      schoolId,
    });

    await expect(() =>
      sut.execute({
        name: 'A',
        capacity: 30,
        gradeId: grade.id,
        academicYearId: 'non-existing-academic-year-id',
        schoolId,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
