import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { JwtAuthGuard } from './auth/guard/auth.guard';
import { SchoolsModule } from './schools/schools.module';
import { PlatformModule } from './platform/platform.module';
import { AuditModule } from './audit/audit.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    AuditModule,
    UsersModule,
    AuthModule,
    SchoolsModule,
    PlatformModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
