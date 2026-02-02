import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAcademicYearDTO } from './dto/create-academic-year.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { AcademicYearsRepository } from './repositories/academic-years.repository';
import { AuditService } from '@/audit/audit.service';

@Injectable()
export class AcademicYearsService {
  constructor(
    private prismaService: PrismaService,
    private academicYearsRepository: AcademicYearsRepository,
    private auditLogsService: AuditService,
  ) {}

  async create(
    { year, endDate, label, startDate, isActive }: CreateAcademicYearDTO,
    schoolId: string,
    performedByUserId: string,
  ) {
    const doesThisAcademicYearExist =
      await this.academicYearsRepository.findByYear(year, schoolId);
    if (doesThisAcademicYearExist) {
      throw new ConflictException(
        'An academic year with this year already exists.',
      );
    }

    return await this.prismaService.$transaction(async (tx) => {
      if (isActive) {
        await this.academicYearsRepository.deactivateAll(schoolId, tx);

        await this.auditLogsService.log(
          {
            action: 'DEACTIVATE_ACADEMIC_YEARS',
            entity: 'ACADEMIC_YEAR',
            schoolId: schoolId,
            userId: performedByUserId,
            newData: { message: 'All academic years deactivated' },
          },
          tx,
        );
      }

      const academicYear = await this.academicYearsRepository.save(
        {
          year,
          endDate,
          label,
          startDate,
          schoolId,
          isActive,
        },
        tx,
      );

      await this.auditLogsService.log(
        {
          action: 'CREATE_ACADEMIC_YEAR',
          entity: 'ACADEMIC_YEAR',
          schoolId: schoolId,
          userId: performedByUserId,
          newData: academicYear,
          entityId: academicYear.id,
        },
        tx,
      );

      return academicYear;
    });
  }

  async activateAcademicYear(
    id: string,
    schoolId: string,
    performedByUserId: string,
  ) {
    const academicYear = await this.academicYearsRepository.findById(id);
    if (!academicYear || academicYear.schoolId !== schoolId) {
      throw new ConflictException('Academic year not found.');
    }

    return await this.prismaService.$transaction(async (tx) => {
      await this.academicYearsRepository.deactivateAll(schoolId, tx);

      await this.auditLogsService.log(
        {
          action: 'DEACTIVATE_ACADEMIC_YEARS',
          entity: 'ACADEMIC_YEAR',
          schoolId: schoolId,
          userId: performedByUserId,
          newData: { message: 'All academic years deactivated' },
        },
        tx,
      );

      const activated = await this.academicYearsRepository.activate(
        schoolId,
        id,
        tx,
      );

      await this.auditLogsService.log(
        {
          action: 'ACTIVATE_ACADEMIC_YEAR',
          entity: 'ACADEMIC_YEAR',
          schoolId: schoolId,
          userId: performedByUserId,
          newData: { message: `Academic year ${id} activated` },
          entityId: id,
        },
        tx,
      );

      return activated;
    });
  }
}
