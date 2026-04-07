import { Module } from '@nestjs/common';
import { PenaltyPoliciesController } from './penalty-policies.controller';
import { FeeTypesRepository } from '../fee-types/repositories/fee-types.repository';
import { PrismaFeeTypesRepository } from '../fee-types/repositories/prisma/prisma-fee-types.repository';
import { AcademicYearsRepository } from '../academic-years/repositories/academic-years.repository';
import { PrismaAcademicYearsRepository } from '../academic-years/repositories/prisma/prisma-academic-year.repository';
import { GradesRepository } from '../grades/repositories/grades.repository';
import { PrismaGradesRepository } from '../grades/repositories/prisma/prisma-grades.repository';
import { PenaltyPolicyRepository } from './repositories/penalty-policy.repository';
import { PrismaPenaltyPolicyRepository } from './repositories/prisma/prisma-penalty-policy.repository';
import { CreatePenaltyPolicyUseCase } from './use-cases/create-penalty-policy.use-case';

@Module({
  controllers: [PenaltyPoliciesController],
  providers: [
    CreatePenaltyPolicyUseCase,
    {
      provide: FeeTypesRepository,
      useClass: PrismaFeeTypesRepository,
    },
    {
      provide: AcademicYearsRepository,
      useClass: PrismaAcademicYearsRepository,
    },
    {
      provide: GradesRepository,
      useClass: PrismaGradesRepository,
    },
    {
      provide: PenaltyPolicyRepository,
      useClass: PrismaPenaltyPolicyRepository,
    },
  ],
})
export class PenaltyPoliciesModule {}
