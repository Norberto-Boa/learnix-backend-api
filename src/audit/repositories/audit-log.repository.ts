import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type {
  InputJsonValue,
  JsonNullClass,
} from '@prisma/client/runtime/client';

interface saveStudent {
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

  async save(data: saveStudent) {
    return this.prismaService.auditLog.create({ data });
  }
}
