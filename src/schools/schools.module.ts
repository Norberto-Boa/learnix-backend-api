import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsRepository } from './schools.repositories';

@Module({
  providers: [SchoolsService, SchoolsRepository],
  exports: [SchoolsService, SchoolsRepository],
})
export class SchoolsModule {}
