import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/env/env';
import { EnvModule } from './env/env.module';

@Module({
  imports: [EnvModule, PrismaModule],
})
export class AppModule {}
