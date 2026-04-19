import type { PENALTY_MODE } from '@/generated/prisma/enums';
import { Injectable } from '@nestjs/common';
import type { PenaltyPolicyDomain } from '../domain/penalty-policy';
import { PenaltyPolicyRepository } from '../repositories/penalty-policy.repository';
import { FeeTypesRepository } from '@/fee-types/repositories/fee-types.repository';
import { AcademicYearsRepository } from '@/academic-years/repositories/academic-years.repository';
import { GradesRepository } from '@/grades/repositories/grades.repository';
import { PenaltyPolicyNotFoundError } from '../errors/penalty-policy-not-found.error';
import { TriggerFeeTypeAndPenaltyFeeTypeIsEqualError } from '../errors/trigger-fee-type-and-penalty-fee-type-is-equal.error';
import { TriggerFeeTypeNotFoundError } from '../errors/trigger-fee-type-not-found.error';
import { TriggerFeeTypeMustBeNormalError } from '../errors/trigger-fee-type-must-be-normal.error';
import { PenaltyFeeTypeNotFoundError } from '../errors/penalty-fee-type-not-found.error';
import { PenaltyFeeTypeMustBePenaltyError } from '../errors/penalty-fee-type-must-be-penalty.error';
import { AcademicYearNotFoundError } from '@/academic-years/errors/academic-year-not-found.error';
import { GradeNotFoundError } from '@/grades/errors/grade-not-found.error';
import { IntervalDaysMustBeGreaterThanZero } from '../errors/interval-days-must-be-greater-than-zero.error';
import { IntervalDaysMustOnlyBeProvidedForIntervalMode } from '../errors/interval-days-must-only-be-on-interval-mode.error';
import { PenaltyPolicyAlreadyExistsError } from '../errors/penalty-policy-already-exists.error';

export interface UpdatePenaltyPolicyUseCaseRequest {
  id: string;
  name?: string;
  triggerFeeTypeId?: string;
  penaltyFeeTypeId?: string;
  academicYearId?: string;
  gradeId?: string | null;
  mode?: PENALTY_MODE;
  value?: number;
  graceDay?: number;
  intervalDays?: number | null;
  isActive?: boolean;
}

export interface UpdatePenaltyPolicyUseCaseResponse {
  oldData: PenaltyPolicyDomain;
  currentData: PenaltyPolicyDomain;
}

@Injectable()
export class UpdatePenaltyPolicyUseCase {
  constructor(
    private readonly penaltyPolicyRepository: PenaltyPolicyRepository,
    private readonly feeTypesRepository: FeeTypesRepository,
    private readonly academicYearsRepository: AcademicYearsRepository,
    private readonly gradesRepository: GradesRepository,
  ) {}

  async execute(
    {
      id,
      triggerFeeTypeId,
      penaltyFeeTypeId,
      academicYearId,
      gradeId,
      graceDay,
      intervalDays,
      mode,
      name,
      value,
      isActive,
    }: UpdatePenaltyPolicyUseCaseRequest,
    schoolId: string,
  ): Promise<UpdatePenaltyPolicyUseCaseResponse> {
    const existing = await this.penaltyPolicyRepository.findById(id, schoolId);

    if (!existing) {
      throw new PenaltyPolicyNotFoundError();
    }

    const nextTriggerFeeTypeId = triggerFeeTypeId ?? existing.triggerFeeTypeId;
    const nextPenaltyFeeTypeId = penaltyFeeTypeId ?? existing.penaltyFeeTypeId;
    const nextAcademicYearId = academicYearId ?? existing.academicYearId;
    const nextGradeId = gradeId !== undefined ? gradeId : existing.gradeId;
    const nextMode = mode ?? existing.mode;
    const nextIntervalDays =
      intervalDays !== undefined ? intervalDays : existing.intervalDays;

    if (nextTriggerFeeTypeId === nextPenaltyFeeTypeId) {
      throw new TriggerFeeTypeAndPenaltyFeeTypeIsEqualError();
    }

    const triggerFeeType = await this.feeTypesRepository.findById(
      nextTriggerFeeTypeId,
      schoolId,
    );

    if (!triggerFeeType) {
      throw new TriggerFeeTypeNotFoundError();
    }

    if (triggerFeeType.category !== 'NORMAL') {
      throw new TriggerFeeTypeMustBeNormalError();
    }

    const penaltyFeeType = await this.feeTypesRepository.findById(
      nextPenaltyFeeTypeId,
      schoolId,
    );

    if (!penaltyFeeType) {
      throw new PenaltyFeeTypeNotFoundError();
    }

    if (penaltyFeeType.category !== 'PENALTY') {
      throw new PenaltyFeeTypeMustBePenaltyError();
    }

    const academicYear = await this.academicYearsRepository.findById(
      nextAcademicYearId,
      schoolId,
    );

    if (!academicYear) {
      throw new AcademicYearNotFoundError();
    }

    if (nextGradeId) {
      const grade = await this.gradesRepository.findById(nextGradeId, schoolId);

      if (!grade) {
        throw new GradeNotFoundError();
      }
    }

    const isIntervalMode =
      nextMode === 'INTERVAL_FIXED' || nextMode === 'INTERVAL_PERCENTAGE';

    if (isIntervalMode && (!nextIntervalDays || nextIntervalDays <= 0)) {
      throw new IntervalDaysMustBeGreaterThanZero();
    }

    if (!isIntervalMode && nextIntervalDays != null) {
      throw new IntervalDaysMustOnlyBeProvidedForIntervalMode();
    }

    const duplicate = await this.penaltyPolicyRepository.findDuplicate(
      schoolId,
      nextAcademicYearId,
      nextTriggerFeeTypeId,
      nextGradeId ?? null,
      existing.id,
    );

    if (duplicate) {
      throw new PenaltyPolicyAlreadyExistsError();
    }

    const updatedPenaltyPolicy = await this.penaltyPolicyRepository.update(
      id,
      schoolId,
      {
        ...(name !== undefined && { name }),
        ...(triggerFeeTypeId !== undefined && { triggerFeeTypeId }),
        ...(penaltyFeeTypeId !== undefined && { penaltyFeeTypeId }),
        ...(academicYearId !== undefined && { academicYearId }),
        ...(gradeId !== undefined && { gradeId }),
        ...(mode !== undefined && { mode }),
        ...(value !== undefined && { value: value }),
        ...(graceDay !== undefined && { graceDay }),
        ...(intervalDays !== undefined && { intervalDays }),
        ...(isActive !== undefined && { isActive }),
      },
    );

    return {
      oldData: existing,
      currentData: updatedPenaltyPolicy,
    };
  }
}
