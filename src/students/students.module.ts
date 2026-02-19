import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { CreateStudentUseCase } from './use-cases/create-student.use-case';
import { StudentsRepository } from './repositories/students.repository';
import { PrismaStudentsRepository } from './repositories/prisma/prisma-students-repository';
import { StudentDocumentsRepository } from '@/student-documents/repositories/students-documents.repository';
import { PrismaStudentDocumentsRepository } from '../student-documents/repositories/prisma/prisma-student-documents.repository';
import { GetStudentByIdUseCase } from './use-cases/get-student-by-id.use-case';
import { GetStudentsUseCase } from './use-cases/get-students.use-case';
import { UpdateStudentUseCase } from './use-cases/update-student.use-case';
import { DeactivateStudentUseCase } from './use-cases/deactivate-student.use-case';
import { ActivateStudentUseCase } from './use-cases/activate-student.use-case';

@Module({
  controllers: [StudentsController],
  providers: [
    CreateStudentUseCase,
    GetStudentByIdUseCase,
    GetStudentsUseCase,
    UpdateStudentUseCase,
    DeactivateStudentUseCase,
    ActivateStudentUseCase,
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: StudentDocumentsRepository,
      useClass: PrismaStudentDocumentsRepository,
    },
  ],
})
export class StudentsModule {}
