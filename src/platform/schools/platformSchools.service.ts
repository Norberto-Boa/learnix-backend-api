import { AuditService } from '@/audit/audit.service';
import type {
  SchoolCreateInput,
  SchoolUpdateInput,
} from '@/generated/prisma/models';
import { PrismaService } from '@/prisma/prisma.service';
import { SchoolsRepository } from '@/schools/schools.repositories';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { generateUniqueSlug } from './utils/generate-unique-slug';

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
      const school = await this.schoolsRepository.save(
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

  async update(
    id: string,
    { name, status }: SchoolUpdateInput,
    performeByUserId: string,
  ) {
    const school = await this.schoolsRepository.findById(id);
    if (!school) throw new NotFoundException('School not found!');
    let slug;
    if (name && typeof name === 'string' && name !== school.name) {
      slug = await generateUniqueSlug(name, this.schoolsRepository);
    }

    return await this.prismaService.$transaction(async (tx) => {
      const updatedSchool = await this.schoolsRepository.update(
        id,
        { name, status, slug: slug ? slug : undefined },
        tx,
      );

      this.auditService.log({
        action: 'UPDATE_SCHOOL',
        entity: 'SCHOOL',
        schoolId: school.id,
        userId: performeByUserId,
        entityId: school.id,
        oldData: {
          name: school.name,
          status: school.status,
          slug: school.slug,
        },
        newData: {
          name: updatedSchool.name,
          status: updatedSchool.status,
          slug: updatedSchool.slug,
        },
      });
    });
  }
}
