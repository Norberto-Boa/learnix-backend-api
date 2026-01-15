import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { PlatformSchoolsService } from './schools.service';
import { Roles } from '@/auth/decorators/roles.decorator';
import {
  createSchoolSchema,
  type CreateSchoolDTO,
} from './dto/create-school.dto';
import { SchoolsService } from '@/schools/schools.service';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { CreateUserSchema } from '@/users/dto/create-user.dto';

@Controller()
export class PlatformSchoolsController {
  constructor(
    private coreSchoolsService: SchoolsService,
    private platformSchoolsService: PlatformSchoolsService,
  ) {}

  @Post()
  @Roles('SUPERADMIN')
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

    const slug = await this.generateUniqueSlug(name);

    const school = this.platformSchoolsService.create(
      {
        name: name,
        nuit: nuit,
        slug: slug,
        status: 'ACTIVO',
      },
      id,
    );
  }

  private slugifySchoolName(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private async generateUniqueSlug(name): Promise<string> {
    const baseSlug = this.slugifySchoolName(name);
    let slug = baseSlug;
    let count = 1;

    while (await this.coreSchoolsService.findSchoolByslug(slug)) {
      slug = `${baseSlug}-${count}`;
    }

    return slug;
  }
}
