import { createZodDto } from 'nestjs-zod';
import { SchoolBaseSchema } from './school-base.dto';

export const createSchoolSchema = SchoolBaseSchema.omit({
  slug: true,
  status: true,
});

export class CreateSchoolDTO extends createZodDto(createSchoolSchema) {}
