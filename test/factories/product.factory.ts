import { faker } from '@faker-js/faker';

type ProductFactoryOverrides = Partial<{
  name: string;
  code: string;
  price: number;
}>;

export function productFactory(overides: ProductFactoryOverrides = {}) {
  return {
    name: overides.name ?? faker.commerce.product(),
    code: overides.code ?? faker.commerce.isbn(),
    price: overides.price ?? Number(faker.commerce.price()),
  };
}
