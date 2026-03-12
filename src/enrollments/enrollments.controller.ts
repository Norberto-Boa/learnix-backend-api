import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateEnrollmentUseCase } from './use-cases/create-enrollment.use-case';
import { AuditService } from '@/audit/audit.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  CreateEnrollmentDTO,
  CreateEnrollmentSchema,
} from './dto/create-enrollment.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guard/roles.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly createEnrollmentUseCase: CreateEnrollmentUseCase,
    private readonly auditService: AuditService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({ status: 201, description: 'Enrollment Created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation or business rule error',
  })
  @ApiResponse({ status: 404, description: 'Related entity not found' })
  @ApiResponse({ status: 409, description: 'Enrollment conflict' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @UsePipes()
  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateEnrollmentSchema))
    data: CreateEnrollmentDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const enrollment = await this.createEnrollmentUseCase.execute(
        {
          academicYearId: data.academicYearId,
          classroomId: data.classroomId,
          schoolId,
          studentId: data.studentId,
          status: data.status,
        },
        tx,
      );

      await this.auditService.log(
        {
          action: 'CREATE_ENROLLMENT',
          entity: 'ENROLLMENT',
          schoolId,
          userId,
          entityId: enrollment.id,
          newData: {
            id: enrollment.id,
          },
        },
        tx,
      );
    });
  }
}
