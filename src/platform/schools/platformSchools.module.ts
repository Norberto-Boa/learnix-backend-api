import { SchoolsModule } from '@/schools/schools.module';
import { Module } from '@nestjs/common';
import { PlatformSchoolsController } from './schools.controller';
import { PlatformSchoolsService } from './schools.service';

@Module({
  imports: [SchoolsModule],
  controllers: [PlatformSchoolsController],
  providers: [PlatformSchoolsService],
})
export class PlatformSchoolsModule {}
