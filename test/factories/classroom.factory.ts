import { faker } from '@faker-js/faker';

type ClassroomFactoryOverrides = Partial<{
  name: string;
  capacity: number;
  gradeId: string;
  academicYearId: string;
  schoolId: string;
}>;

export function classroomFactory(overrides: ClassroomFactoryOverrides = {}) {
  return {
    name:
      overrides.name ?? faker.string.fromCharacters('abcd', { min: 1, max: 1 }),
    capacity: overrides.capacity ?? faker.number.int({ max: 80 }),
    gradeId: overrides.gradeId ?? faker.string.uuid(),
    academicYearId: overrides.academicYearId ?? faker.string.uuid(),
    schoolId: overrides.schoolId ?? faker.string.uuid(),
  };
}
