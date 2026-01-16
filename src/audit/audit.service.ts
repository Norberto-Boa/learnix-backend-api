import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from './repositories/audit-log.repository';

interface AuditData {
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  schoolId: string;
  oldData?: any;
  newData?: any;
}

@Injectable()
export class AuditService {
  constructor(private auditLogsRepository: AuditLogRepository) {}

  async log(data: AuditData) {
    return await this.auditLogsRepository.save({
      action: data.action,
      entity: data.entity,
      schoolId: data.schoolId,
      userId: data.userId,
      entityId: data.entityId ?? undefined,
      payload: {
        before: data.oldData,
        after: data.newData,
      } as any,
    });
  }
}
