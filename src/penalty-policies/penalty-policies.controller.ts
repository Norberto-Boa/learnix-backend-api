import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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

@Controller('penalty-policies')
export class PenaltyPoliciesController {
  constructor(
    private readonly createPenaltyPolicyUseCase: CreatePenaltyPolicyUseCase,
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'CLERK', 'MANAGER')
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
}
