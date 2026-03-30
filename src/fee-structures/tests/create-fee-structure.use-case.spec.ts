import { InMemoryFeeTypesRepository } from '@/fee-types/repositories/in-memory/in-memory-fee-types.repository';
import { InMemoryFeeStructuresRepository } from '../repositories/prisma/in-memory/in-memory-fee-structures.repository';
import { InMemoryAcademicYearsRepository } from '@/academic-years/repositories/in-memory/in-memory-academic-years-repository';
import { InMemoryGradesRepository } from '@/grades/repositories/in-memory/in-memory-students.repository';
import { CreateFeeStructureUseCase } from '../use-case/create-fee-structure.use-case';
import { feeTypeFactory } from '@test/factories/feeType.factory';
import { academicYearFactory } from '@test/factories/academicYear.factory';
import { feeStructureFactory } from '@test/factories/feeStructure.factory';
import { gradeFactory } from '@test/factories/grade.factory';
import { AmountLessThanZeroError } from '../errors/amount-less-than-zero.error';
import { BadRequestException } from '@nestjs/common';
import { ScopeSchoolCannotHaveGradeError } from '../errors/scope-school-cannot-have-grade.error';
import { GradeIdRequiredError } from '../errors/grade-id-required.error';
import { FeeTypeNotFoundError } from '@/fee-types/errors/fee-type-not-found.error';
import { AcademicYearNotFoundError } from '@/academic-years/errors/academic-year-not-found.error';
import { GradeNotFoundError } from '@/grades/errors/grade-not-found.error';
import { FeeStructureAlreadyExistsError } from '../errors/fee-structure-already-exists.error';

let feeStructuresRepository: InMemoryFeeStructuresRepository;
let feeTypesRepoitory: InMemoryFeeTypesRepository;
let academicYearRepository: InMemoryAcademicYearsRepository;
let gradesRepository: InMemoryGradesRepository;
let sut: CreateFeeStructureUseCase;

describe('Create Fee Structure Use Case', () => {
  beforeEach(() => {
    feeStructuresRepository = new InMemoryFeeStructuresRepository();
    feeTypesRepoitory = new InMemoryFeeTypesRepository();
    academicYearRepository = new InMemoryAcademicYearsRepository();
    gradesRepository = new InMemoryGradesRepository();
    sut = new CreateFeeStructureUseCase(
      feeStructuresRepository,
      feeTypesRepoitory,
      academicYearRepository,
      gradesRepository,
    );
  });

  it('should be able to create a fee structure', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    const { feeStructure } = await sut.execute(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        scope: 'SCHOOL',
      }),
      'school-1',
    );

    expect(feeStructure).toBeDefined();
    expect(feeStructure.feeTypeId).toBe(feeType.id);
    expect(feeStructure.academicYearId).toBe(academicYear.id);
  });

  it('should be able to create a grade scoped fee structure', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );
    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    const { feeStructure } = await sut.execute(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        scope: 'GRADE',
        gradeId: grade.id,
      }),
      'school-1',
    );

    expect(feeStructure.scope).toBe('GRADE');
    expect(feeStructure.gradeId).toBe(grade.id);
  });

  it('should not be able to a create a fee structure with amount less or equal to zero', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          amount: 0,
          scope: 'SCHOOL',
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(AmountLessThanZeroError);
  });

  it('Should not allow gradeId when scope is SCHOOL', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );
    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
          scope: 'SCHOOL',
          gradeId: grade.id,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(ScopeSchoolCannotHaveGradeError);
  });

  it('Should not allow to create a grade scoped fee structure without a gradeId', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
          scope: 'GRADE',
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(GradeIdRequiredError);
  });

  it('Should not allow to create a fee structure when academic year does not exist', async () => {
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          academicYearId: academicYear.id,
          scope: 'GRADE',
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });

  it('Should not allow to create a fee structure when academic year does not exist', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          feeTypeId: feeType.id,
          scope: 'GRADE',
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(AcademicYearNotFoundError);
  });

  it('Should not allow to create a grade scoped fee structure when grade does not exist', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
          gradeId: 'non-existing-grade-id',
          scope: 'GRADE',
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(GradeNotFoundError);
  });

  it('Should not allow to create a school scoped duplicate feeStructure', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
      }),
      'school-1',
    );

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(FeeStructureAlreadyExistsError);
  });

  it('Should not allow to create a grade scoped duplicate feeStructure', async () => {
    const feeType = await feeTypesRepoitory.save(feeTypeFactory(), 'school-1');
    const academicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        scope: 'GRADE',
        gradeId: grade.id,
      }),
      'school-1',
    );

    await expect(() =>
      sut.execute(
        feeStructureFactory({
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
          scope: 'GRADE',
          gradeId: grade.id,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(FeeStructureAlreadyExistsError);
  });
});
