import { Module } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { AcademicYearsRepository } from './repositories/academic-years.repository';
import { AcademicYearsController } from './academic-years.controller';
import { PrismaAcademicYearsRepository } from './repositories/prisma/prisma-academic-year.repository';

@Module({
  providers: [
    AcademicYearsService,
    {
      provide: AcademicYearsRepository,
      useClass: PrismaAcademicYearsRepository,
    },
  ],
  controllers: [AcademicYearsController],
  exports: [AcademicYearsRepository],
})
export class AcademicYearsModule {}
