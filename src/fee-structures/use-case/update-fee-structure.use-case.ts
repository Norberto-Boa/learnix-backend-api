import { FEE_SCOPE } from '@/generated/prisma/enums';
import { Injectable } from '@nestjs/common';
import { FeeStructuresRepository } from '../repositories/fee-structures.repository';
import { FeeTypesRepository } from '@/fee-types/repositories/fee-types.repository';
import { AcademicYearsRepository } from '@/academic-years/repositories/academic-years.repository';
import { GradesRepository } from '@/grades/repositories/grades.repository';
import { FeeStructureDomain } from '../domain/fee-structure';
import { FeeStructureNotFoundError } from '../errors/fee-structure-not-found.error';
import { AmountLessThanZeroError } from '../errors/amount-less-than-zero.error';
import { AcademicYearNotFoundError } from '@/academic-years/errors/academic-year-not-found.error';
import { ScopeSchoolCannotHaveGradeError } from '../errors/scope-school-cannot-have-grade.error';
import { GradeNotFoundError } from '@/grades/errors/grade-not-found.error';
import { FeeStructureAlreadyExistsError } from '../errors/fee-structure-already-exists.error';
import type { DbContext } from '@/prisma/shared/db-context';

interface UpdateFeeStructureUseCaseRequest {
  id: string;
  feeTypeId?: string;
  scope?: FEE_SCOPE;
  academicYearId?: string;
  gradeId?: string | null;
  amount?: number;
}

interface UpdateFeeStructureUseCaseResponse {
  oldFeeStructure: FeeStructureDomain;
  newFeeStructure: FeeStructureDomain;
}

@Injectable()
export class UpdateFeeStructureUseCase {
  constructor(
    private readonly feeStructuresRepository: FeeStructuresRepository,
    private readonly feeTypesRepository: FeeTypesRepository,
    private readonly academicYearsRepository: AcademicYearsRepository,
    private readonly gradesRepository: GradesRepository,
  ) {}

  async execute(
    {
      id,
      feeTypeId,
      scope,
      academicYearId,
      gradeId,
      amount,
    }: UpdateFeeStructureUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ): Promise<UpdateFeeStructureUseCaseResponse> {
    const current = await this.feeStructuresRepository.findById(id, schoolId);

    if (!current) {
      throw new FeeStructureNotFoundError();
    }

    const nextFeeTypeId = feeTypeId ?? current.feeTypeId;
    const nextScope = scope ?? current.scope;
    const nextAcademicYearId = academicYearId ?? current.academicYearId;
    const nextAmount = amount ?? current.amount;

    let nextGradeId = gradeId !== undefined ? gradeId : current.gradeId;

    if (nextAmount <= 0) {
      throw new AmountLessThanZeroError();
    }

    const feeType = await this.feeTypesRepository.findById(
      nextFeeTypeId,
      schoolId,
    );

    if (!feeType) {
      throw new FeeStructureNotFoundError();
    }

    const academicYear = await this.academicYearsRepository.findById(
      nextAcademicYearId,
      schoolId,
    );

    if (!academicYear) {
      throw new AcademicYearNotFoundError();
    }

    if (nextScope === FEE_SCOPE.SCHOOL) {
      if (gradeId !== undefined && gradeId !== null) {
        throw new ScopeSchoolCannotHaveGradeError();
      }
    }

    if (nextGradeId) {
      const grade = await this.gradesRepository.findById(nextGradeId, schoolId);
      if (!grade) {
        throw new GradeNotFoundError();
      }
    }

    const duplicate =
      await this.feeStructuresRepository.findByUniqueCombination(
        schoolId,
        nextFeeTypeId,
        nextAcademicYearId,
        nextGradeId,
      );

    if (duplicate && duplicate.id !== current.id) {
      throw new FeeStructureAlreadyExistsError();
    }

    const updated = await this.feeStructuresRepository.update(
      id,
      schoolId,
      {
        feeTypeId,
        scope,
        academicYearId,
        gradeId,
        amount,
      },
      db,
    );

    return {
      oldFeeStructure: current,
      newFeeStructure: updated,
    };
  }
}
