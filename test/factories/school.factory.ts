import { faker } from '@faker-js/faker';

type SchoolFactoryOverrides = Partial<{
  name: string;
  nuit: string;
  slug: string;
  status: string;
}>;

export function schoolFactory(overides: SchoolFactoryOverrides = {}) {
  const name = faker.company.name();
  return {
    name,
    nuit: faker.string.numeric(9),
    slug: faker.helpers.slugify(name).toLowerCase(),
    status: 'ACTIVE',
  };
}
