import { PENALTY_MODE } from '@/generated/prisma/enums';
import type { DbContext } from '@/prisma/shared/db-context';
import { Injectable } from '@nestjs/common';
import { TriggerFeeTypeAndPenaltyFeeTypeIsEqualError } from '../errors/trigger-fee-type-and-penalty-fee-type-is-equal.error';
import { PenaltyPolicyRepository } from '../repositories/penalty-policy.repository';
import { FeeTypesRepository } from '../../fee-types/repositories/fee-types.repository';
import { AcademicYearsRepository } from '../../academic-years/repositories/academic-years.repository';
import { GradesRepository } from '../../grades/repositories/grades.repository';
import { TriggerFeeTypeNotFoundError } from '../errors/trigger-fee-type-not-found.error';
import { TriggerFeeTypeMustBeNormalError } from '../errors/trigger-fee-type-must-be-normal.error';
import { PenaltyFeeTypeNotFoundError } from '../errors/penalty-fee-type-not-found.error';
import { PenaltyFeeTypeMustBePenaltyError } from '../errors/penalty-fee-type-must-be-penalty.error';
import { AcademicYearNotFoundError } from '../../academic-years/errors/academic-year-not-found.error';
import { GradeNotFoundError } from '@/grades/errors/grade-not-found.error';
import { IntervalDaysMustBeGreaterThanZero } from '../errors/interval-days-must-be-greater-than-zero.error';
import { PenaltyPolicyAlreadyExistsError } from '../errors/penalty-policy-already-exists.error';

interface CreatePenaltyPolicyUseCaseRequest {
  name: string;
  triggerFeeTypeId: string;
  penaltyFeeTypeId: string;
  academicYearId: string;
  gradeId?: string | null;
  mode: PENALTY_MODE;
  value: number;
  graceDay: number;
  intervalDays?: number | null;
  isActive?: boolean;
}

@Injectable()
export class CreatePenaltyPolicyUseCase {
  constructor(
    private readonly penaltyPolicyRepository: PenaltyPolicyRepository,
    private readonly feeTypesRepository: FeeTypesRepository,
    private readonly academicYearsRepository: AcademicYearsRepository,
    private readonly gradesRepository: GradesRepository,
  ) {}

  async execute(
    {
      name,
      triggerFeeTypeId,
      penaltyFeeTypeId,
      academicYearId,
      gradeId,
      mode,
      value,
      graceDay,
      intervalDays,
      isActive,
    }: CreatePenaltyPolicyUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ) {
    if (triggerFeeTypeId === penaltyFeeTypeId) {
      throw new TriggerFeeTypeAndPenaltyFeeTypeIsEqualError();
    }

    const triggerFeeType = await this.feeTypesRepository.findById(
      triggerFeeTypeId,
      schoolId,
    );

    if (!triggerFeeType) {
      throw new TriggerFeeTypeNotFoundError();
    }

    if (triggerFeeType.category !== 'NORMAL') {
      throw new TriggerFeeTypeMustBeNormalError();
    }

    const penaltyFeeType = await this.feeTypesRepository.findById(
      penaltyFeeTypeId,
      schoolId,
    );

    if (!penaltyFeeType) {
      throw new PenaltyFeeTypeNotFoundError();
    }

    if (penaltyFeeType.category !== 'PENALTY') {
      throw new PenaltyFeeTypeMustBePenaltyError();
    }

    const academicYear = await this.academicYearsRepository.findById(
      academicYearId,
      schoolId,
    );

    if (!academicYear) {
      throw new AcademicYearNotFoundError();
    }

    if (gradeId) {
      const grade = await this.academicYearsRepository.findById(
        gradeId,
        schoolId,
      );

      if (!grade) {
        throw new GradeNotFoundError();
      }
    }

    const isIntervalMode =
      mode === PENALTY_MODE.INTERVAL_FIXED || PENALTY_MODE.INTERVAL_PERCENTAGE;

    if (isIntervalMode && (!intervalDays || intervalDays <= 0)) {
      throw new IntervalDaysMustBeGreaterThanZero();
    }

    const duplicate = await this.penaltyPolicyRepository.findDuplicate(
      schoolId,
      academicYearId,
      triggerFeeTypeId,
      gradeId ?? null,
    );

    if (duplicate) {
      throw new PenaltyPolicyAlreadyExistsError();
    }

    const penaltyPolicy = await this.penaltyPolicyRepository.save(
      {
        name,
        triggerFeeTypeId,
        penaltyFeeTypeId,
        academicYearId,
        gradeId: gradeId ?? null,
        mode,
        value: value.toFixed(2),
        graceDay,
        intervalDays: intervalDays ?? null,
        isActive,
      },
      schoolId,
    );

    return { penaltyPolicy };
  }
}
