import { Body, Controller, Post } from '@nestjs/common';
import type { CreateStudentUseCase } from './use-cases/create-student.use-case';
import type { AuditService } from '@/audit/audit.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  CreateStudentDTO,
  createStudentSchema,
} from './dto/create-student.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import type { PrismaService } from '@/prisma/prisma.service';

@Controller('students')
export class StudentsController {
  constructor(
    private createStudentUseCase: CreateStudentUseCase,
    private auditService: AuditService,
    private prismaService: PrismaService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createStudentSchema))
    {
      name,
      dateOfBirth,
      documentNumber,
      documentTypeId,
      gender,
      registrationNumber,
      documentUrl,
    }: CreateStudentDTO,
    @GetUser('id') userId: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const student = await this.createStudentUseCase.execute(
        {
          name,
          dateOfBirth,
          gender,
          registrationNumber,
          document: {
            documentNumber,
            documentTypeId,
            documentUrl,
          },
        },
        schoolId,
      );

      this.auditService.log(
        {
          action: 'CREATE_STUDENT',
          entity: 'STUDENT',
          schoolId,
          userId,
          entityId: student.id,
          newData: {
            id: student.id,
            registrationNumber: student.registrationNumber,
            document: {
              documentNumber,
              documentTypeId,
            },
          },
        },
        tx,
      );
    });
  }
}
