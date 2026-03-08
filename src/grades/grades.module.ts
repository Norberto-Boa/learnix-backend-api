import { Module } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { GradesRepository } from './repositories/grades.repository';
import { PrismaGradesRepository } from './repositories/prisma/prisma-grades.repository';

@Module({
  controllers: [GradesController],
  providers: [
    {
      provide: GradesRepository,
      useClass: PrismaGradesRepository,
    },
  ],
})
export class GradesModule {}
