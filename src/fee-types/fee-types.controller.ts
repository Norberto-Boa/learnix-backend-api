import { AuditService } from '@/audit/audit.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
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
import { queryFeeTypesSchema, type QueryFeeTypesDTO } from './dto/query-fee-types.dto';
import { GetFeeTypesUseCase } from './use-cases/get-fee-types.use-case';

@ApiTags('Fee Types')
@Controller('fee-types')
export class FeeTypesController {
  constructor(
    private readonly createFeeTypeUseCase: CreateFeeTypeUseCase,
    private readonly getFeeTypesUseCase: GetFeeTypesUseCase,
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
    @Body(new ZodValidationPipe(createFeeTypeSchema)) { name, code, category, isRecurring }: CreateFeeTypeDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const feeType = await this.createFeeTypeUseCase.execute({
        name,
        code,
        category,
        isRecurring
      }, schoolId, tx)

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
        tx
      )

      return feeType;
    })

  }

  @ApiOperation({ summary: 'List fee types' })
  @ApiResponse({ status: 200, description: 'Fee types successfully fetched' })
  @ApiResponse({ status: 400, description: 'Input validation error' })
  @UseGuards(RolesGuard)
  @Roles('CLERK', 'ADMIN', 'MANAGER')
  @Get()
  async fetchMany(
    @Query(new ZodValidationPipe(queryFeeTypesSchema)) { search, category, isRecurring }: QueryFeeTypesDTO,
    @GetSchoolId('schoolId') schoolId: string
  ) {
    const { feeTypes } = await this.getFeeTypesUseCase.execute(schoolId, {
      search, category, isRecurring
    })

    return feeTypes;
  }
}
