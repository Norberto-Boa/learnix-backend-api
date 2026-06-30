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
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  createEnrollmentChargeSchema,
  CreateEnrollmentChargeDTO,
} from './dto/create-enrollment-charge.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CreateEnrollmentChargeUseCase } from './use-cases/create-enrollment-charge.use-case';
import { FetchEnrollmentChargesUseCase } from './use-cases/fetch-enrollment-charges.use-case';
import { GetEnrollmentChargeUseCase } from './use-cases/get-enrollment-charge.use-case';
import {
  GetEnrollmentChargesDto,
  getEnrollmentChargesSchema,
} from './dto/get-enrollment-charges.dto';
import { updateEnrollmentChargeSchema } from '@/enrollment-charges/dto/update-enrollment-charge.dto';
import { UpdateEnrollmentChargeDto } from './dto/update-enrollment-charge.dto';
import { UpdateEnrollmentChargeUseCase } from './use-cases/update-enrollment-charge.use-case';
import { CancelEnrollmentChargeUseCase } from '@/enrollment-charges/use-cases/cancel-enrollment-charge.use-case';
import { DeleteEnrollmentChargeUseCase } from './use-cases/delete-enrollment-charg.use-case';

@ApiTags('Enrollment Charges')
@Controller('enrollment-charges')
export class EnrollmentChargesController {
  constructor(
    private readonly auditService: AuditService,
    private readonly prismaService: PrismaService,
    private readonly createEnrollmentChargeUseCase: CreateEnrollmentChargeUseCase,
    private readonly fetchEnrollmentChargeUseCase: FetchEnrollmentChargesUseCase,
    private readonly getEnrollmentChargeUseCase: GetEnrollmentChargeUseCase,
    private readonly updateEnrollmentChargeUseCase: UpdateEnrollmentChargeUseCase,
    private readonly cancelEnrollmentChargeUseCase: CancelEnrollmentChargeUseCase,
    private readonly deleteEnrollmentChargeUseCase: DeleteEnrollmentChargeUseCase,
  ) {}

  @ApiOperation({ summary: 'Creates a new enrollment charges' })
  @ApiResponse({
    status: 201,
    description: 'Enrollment charge sucessfully created!',
  })
  @ApiResponse({ status: 400, description: 'Validation error!' })
  @ApiResponse({
    status: 404,
    description: 'Enrollment, fee type or academic year not found!',
  })
  @ApiResponse({
    status: 409,
    description: 'Enrollment charge already exists!',
  })
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @Post()
  async create(
    @Body(new ZodValidationPipe(createEnrollmentChargeSchema))
    {
      academicYearId,
      enrollmentId,
      feeTypeId,
      baseAmount,
      dueDate,
      penaltyAmount,
      referenceMonth,
      referenceYear,
    }: CreateEnrollmentChargeDTO,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { enrollmentCharge } =
        await this.createEnrollmentChargeUseCase.execute(
          {
            enrollmentId,
            academicYearId,
            feeTypeId,
            baseAmount,
            dueDate,
            referenceMonth,
            referenceYear,
            penaltyAmount,
          },
          schoolId,
          tx,
        );

      await this.auditService.log(
        {
          action: 'CREATE_ENROLLMENT_CHARGE',
          entity: 'ENROLLMENT_CHARGE',
          schoolId,
          userId,
          entityId: enrollmentCharge.id,
          newData: {
            id: enrollmentCharge.id,
          },
        },
        tx,
      );

      return { enrollmentCharge };
    });
  }

  @ApiOperation({})
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'CLERK')
  @Get()
  async fetchMany(
    @Query(new ZodValidationPipe(getEnrollmentChargesSchema))
    {
      limit,
      page,
      academicYearId,
      enrollmentId,
      referenceMonth,
      referenceYear,
      status,
    }: GetEnrollmentChargesDto,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return await this.fetchEnrollmentChargeUseCase.execute(schoolId, {
      academicYearId,
      enrollmentId,
      limit,
      page,
      referenceMonth,
      referenceYear,
      status,
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN', 'CLERK')
  @ApiOperation({ summary: 'Get enrollment charge by id' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment charge successfully fetched',
  })
  @ApiResponse({ status: 404, description: 'Enrollment charge not found' })
  async get(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return await this.getEnrollmentChargeUseCase.execute({ id }, schoolId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @ApiResponse({
    status: 200,
    description: 'Enrollment charge successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Enrollment charge cannot be updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment charge not found',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateEnrollmentChargeSchema))
    { baseAmount, dueDate, penaltyAmount }: UpdateEnrollmentChargeDto,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const { updated, old } = await this.updateEnrollmentChargeUseCase.execute(
        id,
        schoolId,
        {
          baseAmount,
          dueDate,
          penaltyAmount,
        },
        tx,
      );

      await this.auditService.log(
        {
          action: 'UPDATE_ENROLLMENT_CHARGE',
          entity: 'ENROLLMENT_CHARGE',
          schoolId,
          userId,
          entityId: updated.id,
          newData: {
            ...(updated.baseAmount !== old.baseAmount && {
              baseAmount: updated.baseAmount,
            }),
            ...(updated.dueDate !== old.dueDate && {
              dueDate: updated.dueDate,
            }),
            ...(updated.penaltyAmount !== old.penaltyAmount && {
              penaltyAmount: updated.penaltyAmount,
            }),
          },
          oldData: {
            ...(updated.baseAmount !== old.baseAmount && {
              baseAmount: old.baseAmount,
            }),
            ...(updated.dueDate !== old.dueDate && {
              dueDate: old.dueDate,
            }),
            ...(updated.penaltyAmount !== old.penaltyAmount && {
              penaltyAmount: old.penaltyAmount,
            }),
          },
        },
        tx,
      );

      return { enrollmentCharge: updated };
    });
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Cancel enrollment charge' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment charge successfully cancelled',
  })
  @ApiResponse({
    status: 400,
    description: 'Enrollment charge cannot be cancelled',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment charge not found',
  })
  async cancel(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const { enrollmentCharge } =
        await this.cancelEnrollmentChargeUseCase.execute({ id }, schoolId, tx);

      await this.auditService.log(
        {
          action: 'CANCEL_ENROLLMENT_CHARGE',
          entity: 'ENROLLMENT_CHARGE',
          schoolId,
          userId,
          entityId: enrollmentCharge.id,
          newData: {
            id: enrollmentCharge.id,
          },
        },
        tx,
      );

      return enrollmentCharge;
    });
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Delete enrollment charge' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment charge successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Enrollment charge cannot be deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment charge not found',
  })
  async delete(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      await this.deleteEnrollmentChargeUseCase.execute({ id }, schoolId, tx);

      await this.auditService.log(
        {
          action: 'CREATE_ENROLMENT_CHARGE',
          entity: 'ENROLMENT_CHARGE',
          schoolId,
          userId,
          entityId: id,
        },
        tx,
      );

      return {
        message: 'Enrollment charge successfully deleted',
      };
    });
  }
}
