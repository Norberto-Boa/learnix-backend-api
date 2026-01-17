import {
  Body,
  ConflictException,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PlatformSchoolsService } from './platformSchools.service';
import { Roles } from '@/auth/decorators/roles.decorator';
import {
  createSchoolSchema,
  type CreateSchoolDTO,
} from './dto/create-school.dto';
import { SchoolsService } from '@/schools/schools.service';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { UpdateSchoolDTO, updateSchoolSchema } from './dto/update-school.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class PlatformSchoolsController {
  constructor(
    private coreSchoolsService: SchoolsService,
    private platformSchoolsService: PlatformSchoolsService,
  ) {}

  @Post()
  @Roles('SUPERADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Creates a new school for the SaaS ecossystem' })
  @ApiResponse({ status: 200, description: 'School successfully created' })
  @ApiResponse({ status: 409, description: 'Nuit already in use!' })
  @UsePipes()
  async create(
    @Body(new ZodValidationPipe(createSchoolSchema))
    { name, nuit }: CreateSchoolDTO,
    @GetUser('id') id: string,
  ) {
    const doesSchoolWithSameNuitExists =
      await this.coreSchoolsService.findSchoolByNuit(nuit);

    if (doesSchoolWithSameNuitExists) {
      throw new ConflictException('Escola com mesmo nuit ja existe!');
    }

    const school = await this.platformSchoolsService.create(
      {
        name: name,
        nuit: nuit,
        status: 'ACTIVO',
      },
      id,
    );

    return school;
  }

  @Patch(':id')
  @Roles('SUPERADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Updates a school on the SaaS ecossystem' })
  @ApiResponse({ status: 200, description: 'School successfully updated' })
  @ApiResponse({ status: 404, description: 'School not found' })
  @UsePipes()
  async update(
    @Body(new ZodValidationPipe(updateSchoolSchema))
    { name, status }: UpdateSchoolDTO,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    const school = this.platformSchoolsService.update(
      id,
      { name, status },
      userId,
    );

    return school;
  }
}
