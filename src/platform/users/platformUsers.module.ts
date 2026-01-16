import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { PlatformUsersController } from './platformUsers.controller';
import { PlatformUsersService } from './platformUsers.service';
import { SchoolsModule } from '@/schools/schools.module';
import { SchoolsService } from '@/schools/schools.service';

@Module({
  imports: [UsersModule, SchoolsModule],
  controllers: [PlatformUsersController],
  providers: [PlatformUsersService, SchoolsService],
})
export class PlatformUsersModule {}
