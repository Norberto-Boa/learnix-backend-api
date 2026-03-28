import { AuditService } from '@/audit/audit.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFeeTypeUseCase } from './use-cases/create-fee-type.use-case';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  CreateFeeTypeDTO,
  createFeeTypeSchema,
} from './dto/create-free-type.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import {
  queryFeeTypesSchema,
  type QueryFeeTypesDTO,
} from './dto/query-fee-types.dto';
import { FetchFeeTypesUseCase } from './use-cases/fetch-fee-types.use-case';
import { GetFeeTypeUseCase } from './use-cases/get-fee-type.use-case';
import {
  queryFeeTypeByIdSchema,
  type QueryFeeTypeByIdDTO,
} from './dto/query-fee-type-by-id.dto';
import { UpdateFeeTypeUseCase } from './use-cases/update-fee-type.use-case';
import {
  updateFeeTypeParamsSchema,
  updateFeeTypeSchema,
  type UpdateFeeTypeDTO,
  type UpdateFeeTypeParamsDTO,
} from './dto/update-fee-type.dto';
import { deleteFeeTypeSchema, type DeleteFeeTypeDTO } from './dto/delete-fee-type.dto';
import { DeleteFeeTypeUseCase } from './use-cases/delete-fee-type.use-case';

@ApiTags('Fee Types')
@Controller('fee-types')
export class FeeTypesController {
  constructor(
    private readonly createFeeTypeUseCase: CreateFeeTypeUseCase,
    private readonly getFeeTypeByIdUseCase: GetFeeTypeUseCase,
    private readonly fetchFeeTypesUseCase: FetchFeeTypesUseCase,
    private readonly updateFeeTypeUseCase: UpdateFeeTypeUseCase,
    private readonly deleteFeeTypeUseCase: DeleteFeeTypeUseCase,
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) { }

  @ApiOperation({ summary: 'Creates a new fee type' })
  @ApiResponse({ status: 201, description: 'Fee type successfully created' })
  @ApiResponse({ status: 409, description: 'Fee type code already exists' })
  @ApiResponse({ status: 400, description: 'Input validation error' })
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @Post()
  async create(
    @Body(new ZodValidationPipe(createFeeTypeSchema))
    { name, code, category, isRecurring }: CreateFeeTypeDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const feeType = await this.createFeeTypeUseCase.execute(
        {
          name,
          code,
          category,
          isRecurring,
        },
        schoolId,
        tx,
      );

      await this.auditService.log(
        {
          action: 'CREATE_FEE_TYPE',
          entity: 'FEE_TYPE',
          schoolId,
          userId,
          entityId: feeType.id,
          newData: {
            id: feeType.id,
          },
        },
        tx,
      );

      return feeType;
    });
  }

  @ApiOperation({ summary: 'List fee types' })
  @ApiResponse({ status: 200, description: 'Fee types successfully fetched' })
  @ApiResponse({ status: 400, description: 'Input validation error' })
  @UseGuards(RolesGuard)
  @Roles('CLERK', 'ADMIN', 'MANAGER')
  @Get()
  async fetchMany(
    @Query(new ZodValidationPipe(queryFeeTypesSchema))
    { search, category, isRecurring }: QueryFeeTypesDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    const { feeTypes } = await this.fetchFeeTypesUseCase.execute(schoolId, {
      search,
      category,
      isRecurring,
    });

    return feeTypes;
  }

  @ApiOperation({ summary: 'Gets one fee type by id' })
  @ApiResponse({ status: 200, description: 'Fee type successfully fetched' })
  @ApiResponse({ status: 404, description: 'Fee type not found' })
  @UseGuards(RolesGuard)
  @Roles('CLERK', 'ADMIN', 'MANAGER')
  @Get(':id')
  async fetchById(
    @Param(new ZodValidationPipe(queryFeeTypesSchema))
    { id }: QueryFeeTypeByIdDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    const { feeType } = await this.getFeeTypeByIdUseCase.execute(id, schoolId);

    return feeType;
  }


  @ApiOperation({ summary: 'Updates a fee type' })
  @ApiResponse({ status: 200, description: 'Fee type successfully updated' })
  @ApiResponse({ status: 404, description: 'Fee type not found' })
  @ApiResponse({ status: 409, description: 'Fee type code already exists' })
  @ApiResponse({ status: 400, description: 'Input validation error' })
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @Patch(':id')
  async update(
    @Param(new ZodValidationPipe(updateFeeTypeParamsSchema))
    { id }: UpdateFeeTypeParamsDTO,
    @Body(new ZodValidationPipe(updateFeeTypeSchema))
    { name, code, category, isRecurring }: UpdateFeeTypeDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { feeType, oldFeeType } = await this.updateFeeTypeUseCase.execute(
        id,
        schoolId,
        { name, code, category, isRecurring },
        tx,
      );

      this.auditService.log(
        {
          action: 'UPDATE_FEE_TYPE',
          entity: 'FEE_TYPE',
          schoolId,
          userId,
          entityId: feeType.id,
          oldData: {
            name: oldFeeType.name,
            code: oldFeeType.code,
            category: oldFeeType.category,
            isRecurring: oldFeeType.isRecurring,
          },
          newData: {
            name: feeType.name,
            code: feeType.code,
            category: feeType.category,
            isRecurring: feeType.isRecurring,
          },
        },
        tx,
      );

      return feeType;
    });
  }

  @Delete(':id')
  async delete(
    @Param(new ZodValidationPipe(deleteFeeTypeSchema)) { id }: DeleteFeeTypeDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      await this.deleteFeeTypeUseCase.execute(id, schoolId, tx);

      await this.auditService.log(
        {
          action: 'DELETE_FEE_TYPE',
          entity: 'FEE_TYPE',
          schoolId,
          userId,
          entityId: id
        },
        tx
      )
    })
  }
}
