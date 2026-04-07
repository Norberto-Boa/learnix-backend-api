import { InMemoryPenaltyPolicyRepository } from '../repositories/in-memory/in-memory-penalty-policy.repository';
import { InMemoryFeeTypesRepository } from '../../fee-types/repositories/in-memory/in-memory-fee-types.repository';
import { InMemoryAcademicYearsRepository } from '../../academic-years/repositories/in-memory/in-memory-academic-years-repository';
import { InMemoryGradesRepository } from '../../grades/repositories/in-memory/in-memory-students.repository';
import { CreatePenaltyPolicyUseCase } from '../use-cases/create-penalty-policy.use-case';
import { feeTypeFactory } from '@test/factories/feeType.factory';
import { academicYearFactory } from '../../../test/factories/academicYear.factory';
import { penaltyPolicyFactory } from '../../../test/factories/penaltyPolicy.factory';
import { FeeTypeDomain } from '../../../dist/src/fee-types/domain/fee-type';
import { AcademicYearDomain } from '../../academic-years/domain/academic-year';
import { TriggerFeeTypeNotFoundError } from '../errors/trigger-fee-type-not-found.error';
import { PenaltyFeeTypeNotFoundError } from '../errors/penalty-fee-type-not-found.error';
import { TriggerFeeTypeAndPenaltyFeeTypeIsEqualError } from '../errors/trigger-fee-type-and-penalty-fee-type-is-equal.error';
import { AcademicYearNotFoundError } from '@/academic-years/errors/academic-year-not-found.error';
import { GradeNotFoundError } from '../../grades/errors/grade-not-found.error';
import { TriggerFeeTypeMustBeNormalError } from '../errors/trigger-fee-type-must-be-normal.error';
import { PenaltyFeeTypeMustBePenaltyError } from '../errors/penalty-fee-type-must-be-penalty.error';
import { IntervalDaysMustBeGreaterThanZero } from '../errors/interval-days-must-be-greater-than-zero.error';
import { BadRequestException } from '@nestjs/common';
import { PenaltyPolicyAlreadyExistsError } from '../errors/penalty-policy-already-exists.error';

let penaltyPolicyRepository: InMemoryPenaltyPolicyRepository;
let feeTypesRepository: InMemoryFeeTypesRepository;
let academicYearsRepository: InMemoryAcademicYearsRepository;
let gradesRepository: InMemoryGradesRepository;
let sut: CreatePenaltyPolicyUseCase;
let triggerFeeType: FeeTypeDomain;
let penaltyFeeType: FeeTypeDomain;
let academicYear: AcademicYearDomain;

describe('Create Penalty Policy Use Case', () => {
  beforeEach(async () => {
    penaltyPolicyRepository = new InMemoryPenaltyPolicyRepository();
    feeTypesRepository = new InMemoryFeeTypesRepository();
    academicYearsRepository = new InMemoryAcademicYearsRepository();
    gradesRepository = new InMemoryGradesRepository();
    sut = new CreatePenaltyPolicyUseCase(
      penaltyPolicyRepository,
      feeTypesRepository,
      academicYearsRepository,
      gradesRepository,
    );

    triggerFeeType = await feeTypesRepository.save(
      feeTypeFactory({
        category: 'NORMAL',
      }),
      'school-id',
    );

    penaltyFeeType = await feeTypesRepository.save(
      feeTypeFactory({
        category: 'PENALTY',
      }),
      'school-id',
    );

    academicYear = await academicYearsRepository.save(
      academicYearFactory({
        schoolId: 'school-id',
      }),
    );
  });

  it('Should create a penalty policy successfully', async () => {
    const result = await sut.execute(
      penaltyPolicyFactory({
        triggerFeeTypeId: triggerFeeType.id,
        penaltyFeeTypeId: penaltyFeeType.id,
        academicYearId: academicYear.id,
      }),
      'school-id',
    );

    expect(result.penaltyPolicy).toEqual(
      expect.objectContaining({
        triggerFeeTypeId: triggerFeeType.id,
        penaltyFeeTypeId: penaltyFeeType.id,
      }),
    );
  });

  it('should throw when trigger fee type is not found', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          penaltyFeeTypeId: penaltyFeeType.id,
          academicYearId: academicYear.id,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(TriggerFeeTypeNotFoundError);
  });

  it('should throw when penalty fee type is not found', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: triggerFeeType.id,
          academicYearId: academicYear.id,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(PenaltyFeeTypeNotFoundError);
  });

  it('should throw when penalty fee type and trigger fee type are the same ', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: triggerFeeType.id,
          penaltyFeeTypeId: triggerFeeType.id,
          academicYearId: academicYear.id,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(TriggerFeeTypeAndPenaltyFeeTypeIsEqualError);
  });

  it('should throw when academic year is not found ', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: triggerFeeType.id,
          penaltyFeeTypeId: penaltyFeeType.id,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(AcademicYearNotFoundError);
  });

  it('should throw when grade is not found ', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: triggerFeeType.id,
          penaltyFeeTypeId: penaltyFeeType.id,
          academicYearId: academicYear.id,
          gradeId: 'non-existent',
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(GradeNotFoundError);
  });

  it('should throw when trigger fee type year is not NORMAL ', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: penaltyFeeType.id,
          penaltyFeeTypeId: triggerFeeType.id,
          academicYearId: academicYear.id,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(TriggerFeeTypeMustBeNormalError);
  });

  it('should throw when trigger fee type year is not NORMAL ', async () => {
    const normalFeeType = await feeTypesRepository.save(
      feeTypeFactory({
        category: 'NORMAL',
      }),
      'school-id',
    );

    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: triggerFeeType.id,
          penaltyFeeTypeId: normalFeeType.id,
          academicYearId: academicYear.id,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(PenaltyFeeTypeMustBePenaltyError);
  });

  it('should throw when interval mode receives 0 or no interval days', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: triggerFeeType.id,
          penaltyFeeTypeId: penaltyFeeType.id,
          academicYearId: academicYear.id,
          mode: 'INTERVAL_FIXED',
          intervalDays: 0,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(IntervalDaysMustBeGreaterThanZero);
  });

  it('should throw when non-interval mode receives intervalDays', async () => {
    await expect(
      sut.execute(
        penaltyPolicyFactory({
          triggerFeeTypeId: triggerFeeType.id,
          penaltyFeeTypeId: penaltyFeeType.id,
          academicYearId: academicYear.id,
          mode: 'FIXED',
          intervalDays: 5,
        }),
        'school-id',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw when non-interval mode receives intervalDays', async () => {
    (await sut.execute(
      penaltyPolicyFactory({
        triggerFeeTypeId: triggerFeeType.id,
        penaltyFeeTypeId: penaltyFeeType.id,
        academicYearId: academicYear.id,
      }),
      'school-id',
    ),
      await expect(
        sut.execute(
          penaltyPolicyFactory({
            triggerFeeTypeId: triggerFeeType.id,
            penaltyFeeTypeId: penaltyFeeType.id,
            academicYearId: academicYear.id,
          }),
          'school-id',
        ),
      ).rejects.toBeInstanceOf(PenaltyPolicyAlreadyExistsError));
  });
});
