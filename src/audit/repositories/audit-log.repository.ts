import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type {
  InputJsonValue,
  JsonNullClass,
} from '@prisma/client/runtime/client';

interface saveLog {
  action: string;
  entity: string;
  entityId?: string;
  schoolId: string;
  userId: string;
  payload: JsonNullClass | InputJsonValue;
}

@Injectable()
export class AuditLogRepository {
  constructor(private prismaService: PrismaService) {}

  async save(data: saveLog, tx?: TransactionClient) {
    const client = tx ?? this.prismaService;
    return client.auditLog.create({ data });
  }
}
