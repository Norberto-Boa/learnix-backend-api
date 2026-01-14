import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EnvModule, PrismaModule],
})
export class AppModule {}
