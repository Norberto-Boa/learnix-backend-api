import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';

@Module({
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
