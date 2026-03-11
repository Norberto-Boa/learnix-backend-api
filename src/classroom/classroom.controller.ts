import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
import {
  UpdateClassroomSchema,
  type UpdateClassroomDTO,
} from './dto/update-classsroom.dto';
import { UpdateClassroomUseCase } from './use-cases/update-classroom.use-case';
import { DeleteClassroomUseCase } from './use-cases/delete-classroom.use-case';
import {
  GetClassroomsParamsSchema,
  type GetClassroomsParamsDTO,
} from './dto/get-classroom.dto';
import { GetClassroomUseCase } from './use-cases/get-classrooms.use-case';
import { GetClassroomByIdUseCase } from './use-cases/get-classroom-by-id.use-case';

@Controller('classroom')
export class ClassroomController {
  constructor(
    private readonly createClassroomUseCase: CreateClassroomUseCase,
    private readonly updateClassroomUseCase: UpdateClassroomUseCase,
    private readonly deleteClassroomUseCase: DeleteClassroomUseCase,
    private readonly getClassroomsUseCase: GetClassroomUseCase,
    private readonly getClassroomByIdUseCase: GetClassroomByIdUseCase,
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

  @Get()
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN', 'CLERK')
  async getMany(
    @Query(new ZodValidationPipe(GetClassroomsParamsSchema))
    data: GetClassroomsParamsDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return await this.getClassroomsUseCase.execute(data, schoolId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  async getById(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return await this.getClassroomByIdUseCase.execute(id, schoolId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateClassroomSchema))
    data: UpdateClassroomDTO,
    @GetUser('id') userId: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const updatedClassroom = await this.updateClassroomUseCase.execute(
        { id, ...data },
        schoolId,
        tx,
      );

      await this.auditService.log(
        {
          action: 'UPDATE_CLASSROOM',
          entity: 'CLASSROOM',
          schoolId,
          userId,
          entityId: updatedClassroom.id,
          newData: {
            id: updatedClassroom.id,
            name: updatedClassroom.name,
            capacity: updatedClassroom.capacity,
          },
        },
        tx,
      );
    });
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    await this.prismaService.$transaction(async (tx) => {
      await this.deleteClassroomUseCase.execute({ id }, schoolId, tx);

      await this.auditService.log(
        {
          action: 'DELETE_CLASSROOM',
          entity: 'CLASSROOM',
          schoolId,
          userId,
          entityId: id,
          oldData: {
            id,
          },
        },
        tx,
      );
    });
  }
}
