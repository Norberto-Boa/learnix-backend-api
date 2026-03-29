import type { AuditService } from '@/audit/audit.service';
import type { PrismaService } from '@/prisma/prisma.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateFeeStructureDTO,
  createFeeStructureSchema,
} from './dto/create-fee-structure.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import type { CreateFeeStructureUseCase } from './use-case/create-fee-structure.use-case';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import {
  getFeeStructuresQuerySchema,
  GetFeeStructuresQueryDTO,
} from './dto/get-fee-structures-query.dto';
import { FetchFeeStructuresUseCase } from './use-case/fetch-fee-structures.use-case';
import { GetFeeStructureByIdUseCase } from './use-case/get-fee-structure-by-id.use-case';
import {
  updateFeeStructureSchema,
  UpdateFeeStructureDTO,
} from './dto/update-fee-structure.dto';
import { UpdateFeeStructureUseCase } from './use-case/update-fee-structure.use-case';
import { DeleteFeeStructureUseCase } from './use-case/delete-fee-structure.use-case';

@ApiTags('Fee Structures')
@Controller('fee-structures')
export class FeeStructuresController {
  constructor(
    private readonly createFeeStructureUseCase: CreateFeeStructureUseCase,
    private readonly fetchFeeStructuresUseCase: FetchFeeStructuresUseCase,
    private readonly getFeeStructureByIdUseCase: GetFeeStructureByIdUseCase,
    private readonly deleteFeeStructureUseCase: DeleteFeeStructureUseCase,
    private readonly updateFeeStructureUseCase: UpdateFeeStructureUseCase,
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({ summary: 'Create a fee structure' })
  @ApiResponse({
    status: 201,
    description: 'The fee structure has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Validation Error' })
  @ApiResponse({ status: 404, description: 'Related entity not found' })
  @ApiResponse({ status: 409, description: 'Fee structure already exists' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post()
  async create(
    @Body(new ZodValidationPipe(createFeeStructureSchema))
    {
      scope,
      academicYearId,
      amount,
      feeTypeId,
      gradeId,
    }: CreateFeeStructureDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { feeStructure } = await this.createFeeStructureUseCase.execute(
        { scope, academicYearId, amount, feeTypeId, gradeId },
        schoolId,
        tx,
      );

      await this.auditService.log(
        {
          action: 'CREATE_FEE_STRUCTURE',
          entity: 'FEE_STRUCTURE',
          entityId: feeStructure.id,
          schoolId,
          userId,
          newData: {
            id: feeStructure.id,
          },
        },
        tx,
      );

      return feeStructure;
    });
  }

  @ApiOperation({ summary: 'Get all fee structures' })
  @ApiResponse({
    status: 200,
    description: 'Fee structures successfully fetched',
  })
  @UseGuards(RolesGuard)
  @Roles('CLERK', 'ADMIN', 'MANAGER')
  @Get()
  async findMany(
    @Query(new ZodValidationPipe(getFeeStructuresQuerySchema))
    { scope, gradeId, academicYearId, feeTypeId }: GetFeeStructuresQueryDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.fetchFeeStructuresUseCase.execute(
      { scope, gradeId, academicYearId, feeTypeId },
      schoolId,
    );
  }

  @ApiOperation({ summary: 'Get fee structure by id' })
  @ApiResponse({
    status: 200,
    description: 'Fee structure successfully fetched',
  })
  @ApiResponse({ status: 404, description: 'Fee structure not found' })
  @UseGuards(RolesGuard)
  @Roles('CLERK', 'ADMIN', 'MANAGER')
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.getFeeStructureByIdUseCase.execute(id, schoolId);
  }

  @ApiOperation({ summary: 'Update fee structure by id' })
  @ApiResponse({
    status: 200,
    description: 'Fee structure successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Fee structure not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 409,
    description: 'Fee structure with the same combination already exists',
  })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateFeeStructureSchema))
    data: UpdateFeeStructureDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { oldFeeStructure, newFeeStructure } =
        await this.updateFeeStructureUseCase.execute(
          { id, ...data },
          schoolId,
          tx,
        );

      await this.auditService.log({
        action: 'UPDATE_FEE_STRUCTURE',
        entity: 'FEE_STRUCTURE',
        entityId: oldFeeStructure.id,
        schoolId,
        userId,
        oldData: {
          oldFeeStructure,
        },
        newData: {
          newFeeStructure,
        },
      });
    });
  }

  @ApiOperation({ summary: 'Delete fee structure by id' })
  @ApiResponse({
    status: 200,
    description: 'Fee structure successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Fee structure not found' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      await this.deleteFeeStructureUseCase.execute(id, schoolId, tx);

      await this.auditService.log({
        action: 'DELETE_FEE_STRUCTURE',
        entity: 'FEE_STRUCTURE',
        entityId: id,
        schoolId,
        userId,
        oldData: {
          id: id,
        },
      });
    });
  }
}
