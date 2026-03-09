import { Module } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { GradesRepository } from './repositories/grades.repository';
import { PrismaGradesRepository } from './repositories/prisma/prisma-grades.repository';
import { CreateGradeUseCase } from './usecases/create-grade.use-case';
import { GetGradeByIdUseCase } from './usecases/get-grade-by-id.usecase';
import { GetGradesUseCase } from './usecases/get-grades.use-case';
import { UpdateGradeUseCase } from './usecases/update-grade.use-case';
import { DeleteGradeUseCase } from './usecases/delete-grade.use-case';

@Module({
  controllers: [GradesController],
  providers: [
    CreateGradeUseCase,
    GetGradeByIdUseCase,
    GetGradesUseCase,
    UpdateGradeUseCase,
    DeleteGradeUseCase,
    {
      provide: GradesRepository,
      useClass: PrismaGradesRepository,
    },
  ],
})
export class GradesModule {}
