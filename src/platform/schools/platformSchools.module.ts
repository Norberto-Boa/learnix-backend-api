import { SchoolsModule } from '@/schools/schools.module';
import { Module } from '@nestjs/common';
import { PlatformSchoolsController } from './platformSchools.controller';
import { PlatformSchoolsService } from './platformSchools.service';

@Module({
  imports: [SchoolsModule],
  controllers: [PlatformSchoolsController],
  providers: [PlatformSchoolsService],
})
export class PlatformSchoolsModule {}
