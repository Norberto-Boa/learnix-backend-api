import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  createAcademicYearSchema,
  CreateAcademicYearDTO,
} from './dto/create-academic-year.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { AcademicYearsService } from './academic-years.service';

@ApiTags('School / Academic Years')
@Controller('school/academic-years')
export class AcademicYearsController {
  constructor(private academicYearService: AcademicYearsService) {}

  @Post()
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  async create(
    @Body(new ZodValidationPipe(createAcademicYearSchema))
    { label, year, endDate, startDate, isActive }: CreateAcademicYearDTO,
    @GetUser('id') userId: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return await this.academicYearService.create(
      { label, year, endDate, startDate, isActive },
      schoolId,
      userId,
    );
  }
}
