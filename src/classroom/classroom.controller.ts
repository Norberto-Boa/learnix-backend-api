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

@Controller('classroom')
export class ClassroomController {
  constructor(
    private readonly createClassroomUseCase: CreateClassroomUseCase,
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
  ) {
    const result = await this.createClassroomUseCase.execute({
      ...data,
      schoolId,
    });

    return result;
  }
}
