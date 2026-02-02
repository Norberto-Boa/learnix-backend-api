import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';

export interface SaveAcademicYearInput {
  year: number;
  label: string;
  startDate: Date;
  endDate: Date;
  schoolId: string;
  isActive?: boolean;
}

@Injectable()
export class AcademicYearsRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string) {
    return this.prismaService.academicYear.findUnique({
      where: { id },
    });
  }

  async findByYear(year: number, schoolId: string) {
    return this.prismaService.academicYear.findUnique({
      where: { year_schoolId: { year, schoolId } },
    });
  }

  async save(
    {
      year,
      label,
      startDate,
      endDate,
      schoolId,
      isActive,
    }: SaveAcademicYearInput,
    tx: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prismaService;
    return await client.academicYear.create({
      data: {
        year,
        label,
        startDate,
        endDate,
        schoolId,
        isActive: isActive ?? false,
      },
    });
  }

  async deactivateAll(schoolId: string, tx: Prisma.TransactionClient) {
    const client = tx ?? this.prismaService;
    return await client.academicYear.updateMany({
      where: { schoolId, isActive: true },
      data: { isActive: false },
    });
  }
}
