import type { ROLE, STATUS } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';

type UserFactoryOverrides = Partial<{
  name: string;
  email: string;
  password: string;
  role: ROLE;
  schoolId: string;
  status: STATUS;
}>;

export function userFactory(overrides: UserFactoryOverrides) {
  if (!overrides?.schoolId) {
    console.error('[E2E FACTORY] userFactory called without schoolId', {
      overrides,
    });
    throw new Error('Invalid e2e test setup: userFactory requires a schoolId');
  }

  return {
    name: overrides.name ?? faker.person.fullName(),
    email: overrides.email ?? faker.internet.email().toLowerCase(),
    password: overrides.password ?? hashSync('admin123', 8),
    role: overrides.role ?? 'ADMIN',
    status: overrides.status ?? 'ACTIVE',
    schoolId: overrides.schoolId,
  };
}
