import type { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';

type EnrollmentChargeFactoryOverrides = Partial<{
  enrollmentId: string;
  feeTypeId: string;
  academicYearId: string;

  referenceYear: number;
  referenceMonth: number;

  dueDate: Date;

  baseAmount: number;
  penaltyAmount?: number;
  status: ENROLLMENT_STATUS;
}>;

export function enrollmentChargeFactory(
  overrides: EnrollmentChargeFactoryOverrides = {},
) {
  return {
    enrollmentId: overrides.enrollmentId ?? faker.string.uuid(),
    feeTypeId: overrides.feeTypeId ?? faker.string.uuid(),
    academicYearId: overrides.academicYearId ?? faker.string.uuid(),
    referenceYear:
      overrides.referenceYear ?? faker.number.int({ min: 2000, max: 2026 }),
    referenceMonth:
      overrides.referenceYear ?? faker.number.int({ min: 0, max: 12 }),
    status: overrides.status ?? 'PENDING',
    dueDate: overrides.dueDate ?? faker.date.future(),
    baseAmount:
      overrides.baseAmount ?? faker.number.float({ min: 1000, max: 3000 }),
    penaltyAmount: overrides.penaltyAmount,
  };
}
