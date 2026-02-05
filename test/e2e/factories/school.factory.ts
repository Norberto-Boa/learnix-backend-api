import { faker } from '@faker-js/faker';

export function schoolFactory(overides = {}) {
  const name = faker.company.name();
  return {
    name,
    nuit: faker.string.numeric(9),
    slug: faker.helpers.slugify(name).toLowerCase,
    status: 'ACTIVE',
  };
}
