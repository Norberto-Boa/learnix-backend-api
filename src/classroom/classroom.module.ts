import { Module } from '@nestjs/common';
import { ClassroomController } from './classroom.controller';
import { CreateClassroomUseCase } from './use-cases/create-classroom.use-case';
import { ClassroomRepository } from './repositories/classroom.repository';
import { PrismaClassroomRepository } from './repositories/prisma/prisma-classroom.repositories';
import { GradesModule } from '@/grades/grades.module';
import { AcademicYearsModule } from '@/academic-years/academic-years.module';
import { UpdateClassroomUseCase } from './use-cases/update-classroom.use-case';
import { DeleteClassroomUseCase } from './use-cases/delete-classroom.use-case';
import { GetClassroomUseCase } from './use-cases/get-classrooms.use-case';

@Module({
  controllers: [ClassroomController],
  providers: [
    CreateClassroomUseCase,
    UpdateClassroomUseCase,
    DeleteClassroomUseCase,
    GetClassroomUseCase,
    {
      provide: ClassroomRepository,
      useClass: PrismaClassroomRepository,
    },
  ],
  imports: [GradesModule, AcademicYearsModule],
  exports: [ClassroomRepository],
})
export class ClassroomModule {}
