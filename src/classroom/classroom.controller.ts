import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateClassroomUseCase } from './use-cases/create-classroom.use-case';
import { JwtAuthGuard } from '@/auth/guard/auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import {
  ApiAcceptedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ClassroomBaseDTO } from './dto/classsroom-base.dto';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  CreateClassroomSchema,
  type CreateClassroomDTO,
} from './dto/create-classroom.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { AuditService } from '@/audit/audit.service';

@Controller('classroom')
export class ClassroomController {
  constructor(
    private readonly createClassroomUseCase: CreateClassroomUseCase,
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CLERK', 'MANAGER')
  @ApiOperation({ summary: 'Create a classroom' })
  @ApiAcceptedResponse({
    description: 'Classroom created successfully',
    type: ClassroomBaseDTO,
  })
  @ApiResponse({ status: 409, description: 'Classroom already exists' })
  @ApiResponse({ status: 404, description: 'Grade or academic year not found' })
  async create(
    @Body(new ZodValidationPipe(CreateClassroomSchema))
    data: CreateClassroomDTO,
    @GetSchoolId('school') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const classroom = await this.createClassroomUseCase.execute(
        {
          ...data,
          schoolId,
        },
        tx,
      );

      await this.auditService.log(
        {
          action: 'CREATE_CLASSROOM',
          entity: 'CLASSROOM',
          schoolId,
          userId,
          entityId: classroom.id,
          newData: {
            id: classroom.id,
            name: classroom.name,
            capacity: classroom.capacity,
            gradeId: classroom.gradeId,
            academicYearId: classroom.academicYearId,
          },
        },
        tx,
      );

      return classroom;
    });
  }
}
