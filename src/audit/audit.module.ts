import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { AuditInterceptor } from './audit.interceptor';

@Global()
@Module({
  providers: [AuditService, AuditLogRepository, AuditInterceptor],
  exports: [AuditService],
})
export class AuditModule {}
