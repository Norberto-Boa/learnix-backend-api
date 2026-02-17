import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateStudentUseCase } from './use-cases/create-student.use-case';
import { AuditService } from '@/audit/audit.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  CreateStudentDTO,
  createStudentSchema,
} from './dto/create-student.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetStudentByIdUseCase } from './use-cases/get-student-by-id.use-case';
import {
  getStudentByIdParamsSchema,
  GetStudentByIdParamsDTO,
} from './dto/get-student-by-id-params.dto';
import { GetStudentsUseCase } from './use-cases/get-students.use-case';

@Controller('students')
export class StudentsController {
  constructor(
    private createStudentUseCase: CreateStudentUseCase,
    private getStudentByIdUseCase: GetStudentByIdUseCase,
    private getStudentsUseCase: GetStudentsUseCase,
    private auditService: AuditService,
    private prismaService: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Creates new Student with a document attached' })
  @ApiResponse({ status: 200, description: 'Student Successfully creaed' })
  @ApiResponse({ status: 400, description: 'Input error' })
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN', 'CLERK')
  @UsePipes()
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
        tx,
      );

      await this.auditService.log(
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
      return student;
    });
  }

  @Roles('MANAGER', 'ADMIN', 'CLERK')
  @UsePipes()
  @UseGuards(RolesGuard)
  @Get(':id')
  async getById(
    @Param(new ZodValidationPipe(getStudentByIdParamsSchema))
    { id }: GetStudentByIdParamsDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.prismaService.$transaction((tx) => {
      return this.getStudentByIdUseCase.execute(
        { studentId: id },
        schoolId,
        tx,
      );
    });
  }

  @Roles('MANAGER', 'ADMIN', 'CLERK')
  @UsePipes()
  @UseGuards(RolesGuard)
  @Get()
  async getStudents(@GetSchoolId('schoolId') schoolId: string) {
    return this.prismaService.$transaction((tx) => {
      return this.getStudentsUseCase.execute(schoolId, tx);
    });
  }
}
