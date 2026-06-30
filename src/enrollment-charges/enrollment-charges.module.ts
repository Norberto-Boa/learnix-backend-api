import { Module } from '@nestjs/common';
import { EnrollmentChargesController } from './enrollment-charges.controller';
import { CreateEnrollmentChargeUseCase } from './use-cases/create-enrollment-charge.use-case';
import { EnrollmentChargesRepository } from './repositories/enrollment-charges.repository';
import { PrismaEnrollmentChargesRepository } from '@/enrollment-charges/repositories/prisma/prisma-enrollment-charges.repository';
import { EnrollmentsRepository } from '../enrollments/repositories/enrollments.repository';
import { PrismaEnrollmentsRepository } from '@/enrollments/repositories/prisma/prisma-enrollments.repository';
import { FeeTypesRepository } from '@/fee-types/repositories/fee-types.repository';
import { PrismaFeeTypesRepository } from '@/fee-types/repositories/prisma/prisma-fee-types.repository';
import { AcademicYearsRepository } from '@/academic-years/repositories/academic-years.repository';
import { PrismaAcademicYearsRepository } from '@/academic-years/repositories/prisma/prisma-academic-year.repository';
import { FetchEnrollmentChargesUseCase } from '@/enrollment-charges/use-cases/fetch-enrollment-charges.use-case';
import { GetEnrollmentChargeUseCase } from './use-cases/get-enrollment-charge.use-case';
import { UpdateEnrollmentChargeUseCase } from './use-cases/update-enrollment-charge.use-case';
import { CancelEnrollmentChargeUseCase } from '@/enrollment-charges/use-cases/cancel-enrollment-charge.use-case';
import { DeleteEnrollmentChargeUseCase } from './use-cases/delete-enrollment-charg.use-case';

@Module({
  controllers: [EnrollmentChargesController],
  providers: [
    CreateEnrollmentChargeUseCase,
    FetchEnrollmentChargesUseCase,
    GetEnrollmentChargeUseCase,
    UpdateEnrollmentChargeUseCase,
    CancelEnrollmentChargeUseCase,
    DeleteEnrollmentChargeUseCase,
    {
      provide: EnrollmentChargesRepository,
      useClass: PrismaEnrollmentChargesRepository,
    },
    {
      provide: EnrollmentsRepository,
      useClass: PrismaEnrollmentsRepository,
    },
    {
      provide: FeeTypesRepository,
      useClass: PrismaFeeTypesRepository,
    },
    {
      provide: AcademicYearsRepository,
      useClass: PrismaAcademicYearsRepository,
    },
  ],
})
export class EnrollmentChargesModule {}
