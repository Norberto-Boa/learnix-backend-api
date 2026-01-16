import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PlatformSchoolsModule } from './schools/platformSchools.module';
import { PlatformUsersModule } from './users/platformUsers.module';

@Module({
  imports: [
    PlatformSchoolsModule,
    PlatformUsersModule,
    RouterModule.register([
      {
        path: 'platform',
        children: [
          { path: 'schools', module: PlatformSchoolsModule },
          { path: 'users', module: PlatformUsersModule },
        ],
      },
    ]),
  ],
})
export class PlatformModule {}
