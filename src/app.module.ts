import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/env/env';
import { EnvModule } from './env/env.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [EnvModule, PrismaModule, UsersModule],
  providers: [UsersService],
})
export class AppModule {}
