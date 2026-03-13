import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { CreateEnrollmentUseCase } from './use-cases/create-enrollment.use-case';
import { EnrollmentsRepository } from './repositories/enrollments.repository';
import { PrismaEnrollmentsRepository } from './repositories/prisma/prisma-enrollments.repository';
import { StudentsRepository } from '../students/repositories/students.repository';
import { PrismaStudentsRepository } from '@/students/repositories/prisma/prisma-students-repository';
import { ClassroomRepository } from '@/classroom/repositories/classroom.repository';
import { PrismaClassroomRepository } from '@/classroom/repositories/prisma/prisma-classroom.repositories';
import { AcademicYearsRepository } from '@/academic-years/repositories/academic-years.repository';
import { PrismaAcademicYearsRepository } from '@/academic-years/repositories/prisma/prisma-academic-year.repository';
import { GetEnrollmentByIdUseCase } from './use-cases/get-enrollment-by-id.use-case';
import { FetchEnrollmentUseCase } from './use-cases/fetch-enrollments.use-case';
import { CancelEnrollmentUseCase } from './use-cases/cancel-enrollment.use-case';
import { ChangeEnrollmentClassroomUseCase } from './use-cases/change-enrollment-classroom.use-case';

@Module({
  controllers: [EnrollmentsController],
  providers: [
    CreateEnrollmentUseCase,
    GetEnrollmentByIdUseCase,
    FetchEnrollmentUseCase,
    CancelEnrollmentUseCase,
    ChangeEnrollmentClassroomUseCase,
    {
      provide: EnrollmentsRepository,
      useClass: PrismaEnrollmentsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: ClassroomRepository,
      useClass: PrismaClassroomRepository,
    },
    {
      provide: AcademicYearsRepository,
      useClass: PrismaAcademicYearsRepository,
    },
  ],
})
export class EnrollmentsModule {}
