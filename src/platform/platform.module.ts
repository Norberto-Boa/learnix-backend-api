import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PlatformSchoolsModule } from './schools/platformSchools.module';

@Module({
  imports: [
    PlatformSchoolsModule,
    RouterModule.register([
      {
        path: 'platform',
        children: [{ path: 'schools', module: PlatformSchoolsModule }],
      },
    ]),
  ],
})
export class PlatformModule {}
