import { InMemoryPenaltyPolicyRepository } from '../repositories/in-memory/in-memory-penalty-policy.repository';
import { InMemoryFeeTypesRepository } from '../../fee-types/repositories/in-memory/in-memory-fee-types.repository';
import { InMemoryAcademicYearsRepository } from '../../academic-years/repositories/in-memory/in-memory-academic-years-repository';
import { InMemoryGradesRepository } from '../../grades/repositories/in-memory/in-memory-students.repository';
import { UpdatePenaltyPolicyUseCase } from '../use-cases/update-penalty-policy.use-case';
import { penaltyPolicyFactory } from '../../../test/factories/penaltyPolicy.factory';
import { feeTypeFactory } from '@test/factories/feeType.factory';
import { AcademicYearDomain } from '../../../dist/src/academic-years/domain/academic-year';
import type { FeeTypeDomain } from '@/fee-types/domain/fee-type';
import { academicYearFactory } from '../../../test/factories/academicYear.factory';
import type { GradeDomain } from '@/grades/domain/grade';
import { gradeFactory } from '@test/factories/grade.factory';
import type { Grade } from '@/generated/prisma/client';
import type { PenaltyPolicyDomain } from '../domain/penalty-policy';
import { PenaltyPolicyNotFoundError } from '../errors/penalty-policy-not-found.error';
import { TriggerFeeTypeAndPenaltyFeeTypeIsEqualError } from '../errors/trigger-fee-type-and-penalty-fee-type-is-equal.error';
import { IntervalDaysMustBeGreaterThanZero } from '../errors/interval-days-must-be-greater-than-zero.error';
import { PenaltyPolicyAlreadyExistsError } from '../errors/penalty-policy-already-exists.error';

let penaltyPolicyRepository: InMemoryPenaltyPolicyRepository;
let feeTypesRepository: InMemoryFeeTypesRepository;
let academicYearsRepository: InMemoryAcademicYearsRepository;
let gradesRepository: InMemoryGradesRepository;
let sut: UpdatePenaltyPolicyUseCase;

// Helpers
let trigger: FeeTypeDomain;
let penalty: FeeTypeDomain;
let academicYear: AcademicYearDomain;
let grade: Grade;
let created: PenaltyPolicyDomain;

describe('Update Penalty Policy Use Case', () => {
  beforeEach(async () => {
    penaltyPolicyRepository = new InMemoryPenaltyPolicyRepository();
    feeTypesRepository = new InMemoryFeeTypesRepository();
    academicYearsRepository = new InMemoryAcademicYearsRepository();
    gradesRepository = new InMemoryGradesRepository();
    sut = new UpdatePenaltyPolicyUseCase(
      penaltyPolicyRepository,
      feeTypesRepository,
      academicYearsRepository,
      gradesRepository,
    );

    trigger = await feeTypesRepository.save(
      feeTypeFactory({
        category: 'NORMAL',
      }),
      'schoolId',
    );

    penalty = await feeTypesRepository.save(
      feeTypeFactory({
        category: 'PENALTY',
      }),
      'schoolId',
    );

    academicYear = await academicYearsRepository.save(
      academicYearFactory({
        schoolId: 'schoolId',
      }),
    );

    grade = await gradesRepository.save(
      gradeFactory({
        schoolId: 'schoolId',
      }),
    );

    created = await penaltyPolicyRepository.save(
      penaltyPolicyFactory({
        id: '01',
        penaltyFeeTypeId: penalty.id,
        triggerFeeTypeId: trigger.id,
        academicYearId: academicYear.id,
      }),
      'schoolId',
    );
  });

  it('Should update a penalty policy successfully', async () => {
    const { oldData, currentData } = await sut.execute(
      {
        id: created.id,
        name: 'UpdatedPolicy',
        value: 250,
        graceDay: 10,
      },
      'schoolId',
    );

    expect(currentData.name).toBe('UpdatedPolicy');
  });

  it('Should throw when penalty policy is not found', async () => {
    await expect(
      sut.execute(
        {
          id: 'non-existing-id',
          name: 'updated policy',
        },
        'schoolId',
      ),
    ).rejects.toBeInstanceOf(PenaltyPolicyNotFoundError);
  });

  it('Should throw when trigger fee type and penalty fee type are the same after merge', async () => {
    await expect(
      sut.execute(
        {
          id: created.id,
          penaltyFeeTypeId: trigger.id,
        },
        'schoolId',
      ),
    ).rejects.toBeInstanceOf(TriggerFeeTypeAndPenaltyFeeTypeIsEqualError);
  });

  it('Should throw when interval mode is used without  intervalDays after merge', async () => {
    const created2 = await penaltyPolicyRepository.save(
      penaltyPolicyFactory({
        id: '01',
        penaltyFeeTypeId: penalty.id,
        triggerFeeTypeId: trigger.id,
        academicYearId: academicYear.id,
        mode: 'FIXED',
        intervalDays: null,
      }),
      'schoolId',
    );

    await expect(
      sut.execute(
        {
          id: created2.id,
          mode: 'INTERVAL_FIXED',
        },
        'schoolId',
      ),
    ).rejects.toBeInstanceOf(IntervalDaysMustBeGreaterThanZero);
  });

  it('Should throw when duplicate policy exists', async () => {
    const trigger2 = await feeTypesRepository.save(
      feeTypeFactory({
        category: 'NORMAL',
      }),
      'schoolId',
    );

    const created2 = await penaltyPolicyRepository.save(
      penaltyPolicyFactory({
        id: '01',
        penaltyFeeTypeId: penalty.id,
        triggerFeeTypeId: trigger2.id,
        academicYearId: academicYear.id,
      }),
      'schoolId',
    );

    await expect(
      sut.execute(
        {
          id: created.id,
          triggerFeeTypeId: trigger2.id,
        },
        'schoolId',
      ),
    ).rejects.toBeInstanceOf(PenaltyPolicyAlreadyExistsError);
  });
});
