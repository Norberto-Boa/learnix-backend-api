import { Module } from '@nestjs/common';
import { FeeStructuresController } from './fee-structures.controller';
import { PrismaFeeStructresRepository } from './repositories/prisma/prisma-fee-structures.repository';
import { CreateFeeStructureUseCase } from './use-case/create-fee-structure.use-case';
import { UpdateFeeStructureUseCase } from './use-case/update-fee-structure.use-case';
import { FetchFeeStructuresUseCase } from './use-case/fetch-fee-structures.use-case';
import { GetFeeStructureByIdUseCase } from './use-case/get-fee-structure-by-id.use-case';
import { DeleteFeeStructureUseCase } from './use-case/delete-fee-structure.use-case';
import { FeeStructuresRepository } from './repositories/fee-structures.repository';
import { PrismaFeeTypesRepository } from '@/fee-types/repositories/prisma/prisma-fee-types.repository';
import { FeeTypesRepository } from '@/fee-types/repositories/fee-types.repository';
import { PrismaAcademicYearsRepository } from '@/academic-years/repositories/prisma/prisma-academic-year.repository';
import { AcademicYearsRepository } from '@/academic-years/repositories/academic-years.repository';
import { GradesRepository } from '@/grades/repositories/grades.repository';
import { PrismaGradesRepository } from '@/grades/repositories/prisma/prisma-grades.repository';

@Module({
  controllers: [FeeStructuresController],
  providers: [
    CreateFeeStructureUseCase,
    UpdateFeeStructureUseCase,
    FetchFeeStructuresUseCase,
    GetFeeStructureByIdUseCase,
    DeleteFeeStructureUseCase,
    {
      provide: FeeStructuresRepository,
      useClass: PrismaFeeStructresRepository,
    },
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
  ],
})
export class FeeStructuresModule {}
