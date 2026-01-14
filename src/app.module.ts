import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [EnvModule, PrismaModule, UsersModule],
})
export class AppModule {}
