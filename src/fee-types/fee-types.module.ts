import { Module } from '@nestjs/common';
import { FeeTypesController } from './fee-types.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFeeTypeUseCase } from './use-cases/create-fee-type.use-case';
import { FeeTypesRepository } from './repositories/fee-types.repository';
import { PrismaFeeTypesRepository } from './repositories/prisma/prisma-fee-types.repository';
import { FetchFeeTypesUseCase } from './use-cases/fetch-fee-types.use-case';
import { GetFeeTypeUseCase } from './use-cases/get-fee-type.use-case';
import { UpdateFeeTypeUseCase } from './use-cases/update-fee-type.use-case';
import { DeleteFeeTypeUseCase } from './use-cases/delete-fee-type.use-case';

@Module({
  controllers: [FeeTypesController],
  providers: [
    PrismaService,
    CreateFeeTypeUseCase,
    GetFeeTypeUseCase,
    FetchFeeTypesUseCase,
    UpdateFeeTypeUseCase,
    DeleteFeeTypeUseCase,
    {
      provide: FeeTypesRepository,
      useClass: PrismaFeeTypesRepository
    }
  ]
})
export class FeeTypesModule { }
