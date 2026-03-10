import { ApiProperty } from '@nestjs/swagger';

export class ClassroomBaseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  capacity!: number;

  @ApiProperty()
  gradeId!: string;

  @ApiProperty()
  academicYearId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
