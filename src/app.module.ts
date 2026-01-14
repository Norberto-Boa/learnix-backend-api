import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EnvModule, PrismaModule, UsersModule, AuthModule],
})
export class AppModule {}
