import { Injectable } from '@nestjs/common';
import { FeeStructuresRepository } from '../repositories/fee-structures.repository';
import { FeeTypesRepository } from '@/fee-types/repositories/fee-types.repository';
import { AcademicYearsRepository } from '@/academic-years/repositories/academic-years.repository';
import { GradesRepository } from '@/grades/repositories/grades.repository';
import { FEE_SCOPE } from '@/generated/prisma/enums';
import { AmountLessThanZeroError } from '../errors/amount-less-than-zero.error';
import { FeeTypeNotFoundError } from '@/fee-types/errors/fee-type-not-found.error';
import { AcademicYearNotFoundError } from '@/academic-years/errors/academic-year-not-found.error';
import { GradeIdRequiredError } from '../errors/grade-id-required.error';
import { GradeNotFoundError } from '@/grades/errors/grade-not-found.error';
import { FeeStructureAlreadyExistsError } from '../errors/fee-structure-already-exists.error';
import type { DbContext } from '@/prisma/shared/db-context';
import type { FeeStructureDomain } from '../domain/fee-structure';
import { ScopeSchoolCannotHaveGradeError } from '../errors/scope-school-cannot-have-grade.error';

interface CreateFeeStructureUseCaseRequest {
  feeTypeId: string;
  scope: FEE_SCOPE;
  academicYearId: string;
  gradeId?: string | null;
  amount: number;
}

interface CreateFeeStructureUseCaseResponse {
  feeStructure: FeeStructureDomain;
}

@Injectable()
export class CreateFeeStructureUseCase {
  constructor(
    private readonly feeStructuresRepository: FeeStructuresRepository,
    private readonly feeTypesRepository: FeeTypesRepository,
    private readonly academicYearsRepository: AcademicYearsRepository,
    private readonly gradesRepository: GradesRepository,
  ) {}

  async execute(
    {
      feeTypeId,
      scope,
      academicYearId,
      gradeId,
      amount,
    }: CreateFeeStructureUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ): Promise<CreateFeeStructureUseCaseResponse> {
    if (amount <= 0) {
      throw new AmountLessThanZeroError();
    }

    const feeType = await this.feeTypesRepository.findById(feeTypeId, schoolId);

    if (!feeType) {
      throw new FeeTypeNotFoundError();
    }

    const academicYear = await this.academicYearsRepository.findById(
      academicYearId,
      schoolId,
    );

    if (!academicYear) {
      throw new AcademicYearNotFoundError();
    }

    if (scope === FEE_SCOPE.GRADE && !gradeId) {
      throw new GradeIdRequiredError();
    }

    if (scope === FEE_SCOPE.SCHOOL && gradeId) {
      throw new ScopeSchoolCannotHaveGradeError();
    }

    if (gradeId) {
      const grade = await this.gradesRepository.findById(gradeId, schoolId);
      if (!grade) {
        throw new GradeNotFoundError();
      }
    }

    const normalizedGradeId =
      scope === FEE_SCOPE.SCHOOL ? null : (gradeId ?? null);

    const existing = await this.feeStructuresRepository.findByUniqueCombination(
      schoolId,
      feeTypeId,
      academicYearId,
      normalizedGradeId,
    );

    if (existing) {
      throw new FeeStructureAlreadyExistsError();
    }

    const feeStructure = await this.feeStructuresRepository.save(
      {
        feeTypeId,
        scope,
        academicYearId,
        gradeId: normalizedGradeId,
        amount,
      },
      schoolId,
      db,
    );

    return { feeStructure };
  }
}
