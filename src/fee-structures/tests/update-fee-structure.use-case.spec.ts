import { InMemoryFeeTypesRepository } from '@/fee-types/repositories/in-memory/in-memory-fee-types.repository';
import { InMemoryFeeStructuresRepository } from '../repositories/prisma/in-memory/in-memory-fee-structures.repository';
import { InMemoryAcademicYearsRepository } from '@/academic-years/repositories/in-memory/in-memory-academic-years-repository';
import { InMemoryGradesRepository } from '@/grades/repositories/in-memory/in-memory-students.repository';
import { UpdateFeeStructureUseCase } from '../use-case/update-fee-structure.use-case';
import type { FeeTypeDomain } from '@/fee-types/domain/fee-type';
import { feeTypeFactory } from '@test/factories/feeType.factory';
import { academicYearFactory } from '@test/factories/academicYear.factory';
import type { FeeStructureDomain } from '../domain/fee-structure';
import { feeStructureFactory } from '@test/factories/feeStructure.factory';
import { gradeFactory } from '@test/factories/grade.factory';
import { FEE_SCOPE } from '@/generated/prisma/enums';
import { FeeStructureNotFoundError } from '../errors/fee-structure-not-found.error';
import { AmountLessThanZeroError } from '../errors/amount-less-than-zero.error';
import { GradeIdRequiredError } from '../errors/grade-id-required.error';
import { FeeStructureAlreadyExistsError } from '../errors/fee-structure-already-exists.error';

let feeStructuresRepository: InMemoryFeeStructuresRepository;
let feeTypesRepository: InMemoryFeeTypesRepository;
let academicYearsRepository: InMemoryAcademicYearsRepository;
let gradesRepository: InMemoryGradesRepository;
let sut: UpdateFeeStructureUseCase;

let feeType: FeeTypeDomain;
let academicYear: any; // Replace 'any' with the correct type if available

describe('Update Fee Structure Use Case', () => {
  beforeEach(async () => {
    feeStructuresRepository = new InMemoryFeeStructuresRepository();
    feeTypesRepository = new InMemoryFeeTypesRepository();
    academicYearsRepository = new InMemoryAcademicYearsRepository();
    gradesRepository = new InMemoryGradesRepository();
    sut = new UpdateFeeStructureUseCase(
      feeStructuresRepository,
      feeTypesRepository,
      academicYearsRepository,
      gradesRepository,
    );

    feeType = await feeTypesRepository.save(feeTypeFactory(), 'school-1');
    academicYear = await academicYearsRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );
  });

  it('Should be able to update a fee structure amount', async () => {
    const feeStructure = await feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        amount: 500,
      }),
      'school-1',
    );

    const { newFeeStructure } = await sut.execute(
      {
        id: feeStructure.id,
        amount: 800,
      },
      'school-1',
    );

    expect(newFeeStructure.amount).toBe(800);
  });

  it('Should be able to update a fee structure to grade scope', async () => {
    const feeStructure = await feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        amount: 500,
      }),
      'school-1',
    );

    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    const { newFeeStructure } = await sut.execute(
      {
        id: feeStructure.id,
        scope: 'GRADE',
        gradeId: grade.id,
      },
      'school-1',
    );

    expect(newFeeStructure.scope).toBe(FEE_SCOPE.GRADE);
  });

  it('Should be able clear gradeId when updating to school scope', async () => {
    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    const feeStructure = await feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        scope: 'GRADE',
        gradeId: grade.id,
        amount: 500,
      }),
      'school-1',
    );

    const { newFeeStructure } = await sut.execute(
      {
        id: feeStructure.id,
        scope: 'SCHOOL',
      },
      'school-1',
    );

    expect(newFeeStructure.scope).toBe(FEE_SCOPE.SCHOOL);
  });

  it('Should not be able to update non-existent fee structure', async () => {
    await expect(() =>
      sut.execute(
        {
          id: 'non-existent-id',
          amount: 800,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(FeeStructureNotFoundError);
  });

  it('Should not be able to update fee structure with amount less or equal to zero', async () => {
    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    const feeStructure = await feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        scope: 'GRADE',
        gradeId: grade.id,
        amount: 500,
      }),
      'school-1',
    );

    await expect(() =>
      sut.execute(
        {
          id: feeStructure.id,
          amount: 0,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(AmountLessThanZeroError);
  });

  it('Should not be able to update a fee structure to grade scope if gradeId not provided', async () => {
    const feeStructure = await feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        amount: 500,
      }),
      'school-1',
    );

    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    await expect(() =>
      sut.execute(
        {
          id: feeStructure.id,
          scope: FEE_SCOPE.GRADE,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(GradeIdRequiredError);
  });

  it('Should not be able to update a fee structure that duplicates unique combination', async () => {
    const grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'school-1',
      }),
    );

    const feeStructure = await feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        amount: 500,
        gradeId: grade.id,
      }),
      'school-1',
    );

    const feeStructure2 = await feeStructuresRepository.save(
      feeStructureFactory({
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        amount: 500,
      }),
      'school-1',
    );

    await expect(() =>
      sut.execute(
        {
          id: feeStructure2.id,
          scope: FEE_SCOPE.GRADE,
          gradeId: grade.id,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(FeeStructureAlreadyExistsError);
  });
});
