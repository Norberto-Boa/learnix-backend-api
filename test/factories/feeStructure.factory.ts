import type { FEE_SCOPE } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';

type FeeStructureFactoryOverrides = Partial<{
  feeTypeId: string;
  scope: FEE_SCOPE;
  academicYearId: string;
  gradeId: string | null;
  amount: number;
}>;

export function feeStructureFactory(
  overrides: FeeStructureFactoryOverrides = {},
) {
  return {
    feeTypeId: overrides.feeTypeId ?? faker.string.uuid(),
    scope: overrides.scope ?? 'SCHOOL',
    academicYearId: overrides.academicYearId ?? faker.string.uuid(),
    gradeId: overrides.gradeId ?? null,
    amount: overrides.amount ?? faker.number.int({ min: 1000, max: 10000 }),
  };
}
