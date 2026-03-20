import { Module } from '@nestjs/common';
import { FeeTypesController } from './fee-types.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFeeTypeUseCase } from './use-cases/create-fee-type.use-case';
import { FeeTypesRepository } from './repositories/fee-types.repository';
import { PrismaFeeTypesRepository } from './repositories/prisma/prisma-fee-types.repository';

@Module({
  controllers: [FeeTypesController],
  providers: [
    PrismaService,
    CreateFeeTypeUseCase,
    {
      provide: FeeTypesRepository,
      useClass: PrismaFeeTypesRepository
    }
  ]
})
export class FeeTypesModule { }
