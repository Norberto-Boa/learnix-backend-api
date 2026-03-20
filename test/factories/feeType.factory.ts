import { faker } from '@faker-js/faker';
import { FEE_TYPE_CATEGORY } from '@prisma/client';

type FeeTypeFactoryOverrides = Partial<{
  name: string;
  code: string;
  category: FEE_TYPE_CATEGORY;
  isRecurring: boolean;
}>;

export function feeTypeFactory(overrides: FeeTypeFactoryOverrides = {}) {
  return {
    name: overrides.name ?? faker.person.zodiacSign(),
    code: overrides.code ?? faker.finance.currencyCode(),
    category: overrides.category ?? FEE_TYPE_CATEGORY.NORMAL,
    isRecurring: overrides.isRecurring ?? false,
  };
}
