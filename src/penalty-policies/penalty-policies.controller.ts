import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePenaltyPolicyUseCase } from './use-cases/create-penalty-policy.use-case';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  CreatePenaltyPolicyDTO,
  createPenaltyPolicySchema,
} from './dto/create-penalty-policy.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { GetPenaltyPolicyUseCase } from './use-cases/get-penalty-policy.use-case';
import {
  fetchPenaltyPoliciesQuerySchema,
  type FetchPenaltyPoliciesQueryDTO,
} from './dto/get-penalty-policy.dto';
import { FetchPenaltyPoliciesUseCase } from './use-cases/fetch-penalty-policies.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatePenaltyPolicyUseCase } from './use-cases/update-penalty-policy.use-case';
import {
  updatePenaltyPolicySchema,
  type UpdatePenaltyPolicyDTO,
} from './dto/update-penalty-policy.dto';

@Controller('penalty-policies')
export class PenaltyPoliciesController {
  constructor(
    private readonly createPenaltyPolicyUseCase: CreatePenaltyPolicyUseCase,
    private readonly getPenaltyPolicyUseCase: GetPenaltyPolicyUseCase,
    private readonly fetchPenaltyPoliciesUseCase: FetchPenaltyPoliciesUseCase,
    private readonly updatePenaltyPolicyUseCase: UpdatePenaltyPolicyUseCase,
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({ summary: 'Create penalty policy' })
  @ApiResponse({
    status: 201,
    description: 'Penalty policy created successfully',
  })
  @ApiResponse({ status: 400, description: 'Input error' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post()
  async create(
    @Body(new ZodValidationPipe(createPenaltyPolicySchema))
    data: CreatePenaltyPolicyDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { penaltyPolicy } = await this.createPenaltyPolicyUseCase.execute(
        data,
        schoolId,
        tx,
      );

      await this.auditService.log(
        {
          action: 'CREATE_PENALTY_POLICY',
          entity: 'PENALTY_POLICY',
          entityId: penaltyPolicy.id,
          schoolId,
          userId,
          newData: {
            id: penaltyPolicy.id,
            name: penaltyPolicy.name,
          },
        },
        tx,
      );

      return penaltyPolicy;
    });
  }

  @ApiOperation({ summary: 'Get penalty policy by id' })
  @ApiResponse({
    status: 200,
    description: 'Penalty policy fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Penalty policy not found' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'CLERK', 'MANAGER')
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return await this.getPenaltyPolicyUseCase.execute({ id }, schoolId);
  }

  @ApiOperation({ summary: 'Fetch Penalty policies' })
  @ApiResponse({
    status: 200,
    description: 'Penalty policies fetched successfully',
  })
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @Get()
  async findMany(
    @Query(new ZodValidationPipe(fetchPenaltyPoliciesQuerySchema))
    query: FetchPenaltyPoliciesQueryDTO,
    @GetSchoolId() schoolId: string,
  ) {
    return this.fetchPenaltyPoliciesUseCase.execute(query, schoolId);
  }

  @ApiOperation({ summary: 'Update penalty policy' })
  @ApiResponse({
    status: 200,
    description: 'Penalty policy updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Penalty policy not found' })
  @Roles('ADMIN', 'MANAGER')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePenaltyPolicySchema))
    body: UpdatePenaltyPolicyDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { oldData, currentData } =
        await this.updatePenaltyPolicyUseCase.execute(
          { id, ...body },
          schoolId,
        );

      await this.auditService.log(
        {
          action: 'UPDATE_PENALTY_POLICY',
          entity: 'PENALTY_POLICY',
          entityId: oldData.id,
          schoolId,
          userId,
          oldData: {
            oldData,
          },
          newData: {
            currentData,
          },
        },
        tx,
      );

      return {
        currentData,
      };
    });
  }
}
