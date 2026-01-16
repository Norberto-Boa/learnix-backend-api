import { AuditService } from '@/audit/audit.service';
import type { SchoolCreateInput } from '@/generated/prisma/models';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlatformSchoolsService {
  private entity = 'SCHOOL';

  constructor(
    private prismaService: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(
    { name, nuit, slug, status }: SchoolCreateInput,
    performedByUserId: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const school = await this.prismaService.school.create({
        data: {
          name,
          nuit,
          slug,
          status,
        },
      });

      await this.auditService.log(
        {
          action: 'CREATE_SCHOOL',
          entity: this.entity,
          entityId: school.id,
          userId: performedByUserId,
          schoolId: school.id,
          newData: {
            id: school.id,
            nuit: school.nuit,
          },
        },
        tx,
      );

      return school;
    });
  }
}
