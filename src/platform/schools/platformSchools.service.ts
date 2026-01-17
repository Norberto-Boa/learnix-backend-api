import { AuditService } from '@/audit/audit.service';
import type { SchoolCreateInput } from '@/generated/prisma/models';
import { PrismaService } from '@/prisma/prisma.service';
import { SchoolsRepository } from '@/schools/schools.repositories';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class PlatformSchoolsService {
  private entity = 'SCHOOL';

  constructor(
    private prismaService: PrismaService,
    private auditService: AuditService,
    private schoolsRepository: SchoolsRepository,
  ) {}

  async create(
    { name, nuit, slug, status }: SchoolCreateInput,
    performedByUserId: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const school = await this.schoolsRepository.create(
        {
          name,
          nuit,
          slug,
          status,
        },
        tx,
      );

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

  async remove(id: string, performedByUserId: string) {
    const school = await this.schoolsRepository.findById(id);
    if (!school) throw new NotFoundException('School not found!');

    return await this.prismaService.$transaction(async (tx) => {
      await this.schoolsRepository.softDelete(id, tx);

      await this.auditService.log(
        {
          action: 'DELETE_SCHOOL',
          entity: 'SCHOOL',
          entityId: school.id,
          userId: performedByUserId,
          schoolId: school.id,
          oldData: {
            id: school.id,
            name: school.name,
          },
        },
        tx,
      );

      return { success: true };
    });
  }
}
