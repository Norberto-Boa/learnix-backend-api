import { faker } from '@faker-js/faker';
import { PENALTY_MODE } from '../../src/generated/prisma/enums';

type PenaltyPolicyFactoryOverrides = Partial<{
  id: string;
  name: string;
  triggerFeeTypeId: string;
  penaltyFeeTypeId: string;
  academicYearId: string;
  gradeId?: string | null;
  mode: PENALTY_MODE;
  value: number;
  graceDay: number;
  intervalDays?: number | null;
  isActive?: boolean;
}>;

export function penaltyPolicyFactory(
  overrides: PenaltyPolicyFactoryOverrides = {},
) {
  const mode = overrides.mode ?? faker.helpers.enumValue(PENALTY_MODE);

  return {
    id: overrides.id ?? faker.string.uuid(),
    name: overrides.name ?? faker.company.name(),
    triggerFeeTypeId: overrides.triggerFeeTypeId ?? faker.string.uuid(),
    penaltyFeeTypeId: overrides.penaltyFeeTypeId ?? faker.string.uuid(),
    academicYearId: overrides.academicYearId ?? faker.string.uuid(),
    gradeId: overrides.gradeId ?? null,
    mode,
    value: overrides.value ?? faker.number.float({ max: 1000 }),
    graceDay: overrides.graceDay ?? faker.number.int({ max: 10 }),
    intervalDays:
      overrides.intervalDays ??
      (mode === PENALTY_MODE.INTERVAL_FIXED ||
      mode === PENALTY_MODE.INTERVAL_PERCENTAGE
        ? faker.number.int({ min: 1 })
        : null),
    isActive: overrides.isActive,
  };
}
