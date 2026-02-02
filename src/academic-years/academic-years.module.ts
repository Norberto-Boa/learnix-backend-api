import { Module } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { AcademicYearsRepository } from './repositories/academic-years.repository';
import { AcademicYearsController } from './academic-years.controller';

@Module({
  providers: [AcademicYearsService, AcademicYearsRepository],
  controllers: [AcademicYearsController],
})
export class AcademicYearsModule {}
