import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateGradeUseCase } from './usecases/create-grade.use-case';
import { Roles } from '@/auth/decorators/roles.decorator';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateGradeDTO, createGradeSchema } from './dto/create-grade.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { GetGradesUseCase } from './usecases/get-grades.use-case';
import { GetGradeByIdUseCase } from './usecases/get-grade-by-id.usecase';
import { UpdateGradeDTO, updateGradeSchema } from './dto/update-grade.dto';
import { UpdateGradeUseCase } from './usecases/update-grade.use-case';
import { DeleteGradeUseCase } from './usecases/delete-grade.use-case';

@Controller('grades')
export class GradesController {
  constructor(
    private createGradeUseCase: CreateGradeUseCase,
    private getGradesUseCase: GetGradesUseCase,
    private getGradeByIdUseCase: GetGradeByIdUseCase,
    private updateGradeUseCase: UpdateGradeUseCase,
    private deleteGradeUseCase: DeleteGradeUseCase,
  ) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @ApiOperation({ summary: 'Create a new grade' })
  @ApiBody({ type: CreateGradeDTO })
  @ApiResponse({
    status: 201,
    description: 'Grade created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'A grade with the same name already exists',
  })
  async create(
    @Body(new ZodValidationPipe(createGradeSchema)) data: CreateGradeDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.createGradeUseCase.execute({ ...data, schoolId });
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @ApiOperation({ summary: 'List grades with pagination' })
  @ApiOkResponse({
    description: 'Grades fetched successfully',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'Grade 1',
    type: String,
  })
  async findMany(
    @GetSchoolId('schoolId') schoolId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.getGradesUseCase.execute(
      {
        page: Number(page),
        limit: Number(limit),
        search,
      },
      schoolId,
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @ApiOperation({ summary: 'Get one grade by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Grade id',
  })
  @ApiOkResponse({
    description: 'Grade fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  async findById(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.getGradeByIdUseCase.execute(id, schoolId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @ApiOperation({ summary: 'Update a grade' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Grade id',
  })
  @ApiBody({ type: UpdateGradeDTO })
  @ApiOkResponse({
    description: 'Grade updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Another grade with the same name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateGradeSchema)) data: UpdateGradeDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.updateGradeUseCase.execute(id, schoolId, data);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @ApiOperation({ summary: 'Soft delete a grade' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Grade id',
  })
  @ApiNoContentResponse({
    description: 'Grade deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  async delete(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    await this.deleteGradeUseCase.execute(id, schoolId);
  }
}
