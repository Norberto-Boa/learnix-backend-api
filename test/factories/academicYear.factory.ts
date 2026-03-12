import { faker } from '@faker-js/faker';

type AcademicYearFactoryOverrides = Partial<{
  year: number;
  label: string;
  startDate: Date;
  endDate: Date;
  schoolId: string;
  isClosed: boolean;
  isActive: boolean;
}>;

export function academicYearFactory(
  overrides: AcademicYearFactoryOverrides = {},
) {
  return {
    year: overrides.year ?? faker.date.recent().getFullYear(),
    label: overrides.label ?? faker.date.recent().getFullYear().toString(),
    startDate: overrides.startDate ?? faker.date.past(),
    endDate: overrides.endDate ?? faker.date.future(),
    schoolId: overrides.schoolId ?? faker.string.uuid(),
    isClosed: overrides.isClosed,
    isActive: overrides.isActive,
  };
}
