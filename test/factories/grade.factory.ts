import { faker } from '@faker-js/faker';

type GradeFactoryOverrides = Partial<{
  name: string;
  order: number;
  schoolId: string;
}>;

export function gradeFactory(overrides: GradeFactoryOverrides = {}) {
  return {
    name: overrides.name ?? faker.lorem.word(),
    order: overrides.order ?? faker.number.int({ min: 1, max: 10 }),
    schoolId: overrides.schoolId ?? faker.string.uuid(),
  };
}
