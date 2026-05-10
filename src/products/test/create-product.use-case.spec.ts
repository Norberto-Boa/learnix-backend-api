import { productFactory } from '@test/factories/product.factory';
import { InMemoryProductsRepository } from '../repositories/in-memory/in-memory-products.repository';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { ProductAlreadyExistsError } from '../errors/product-already-exists.error';

let productsRepository: InMemoryProductsRepository;
let sut: CreateProductUseCase;

describe('CreateProductUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new CreateProductUseCase(productsRepository);
  });

  it('Should be able to create a product', async () => {
    const result = await sut.execute(productFactory(), 'school-id');

    expect(result.product.id).toEqual(expect.any(String));
  });

  it('Should not be able to create two products with the same name in the same school', async () => {
    await sut.execute(productFactory({ name: 'Camisa' }), 'school-1');

    await expect(() =>
      sut.execute(productFactory({ name: 'Camisa' }), 'school-1'),
    ).rejects.toBeInstanceOf(ProductAlreadyExistsError);
  });

  it('Should be able to create with the same in different schools', async () => {
    await sut.execute(productFactory({ name: 'Camisa' }), 'school-1');

    const result = await sut.execute(
      productFactory({ name: 'Camisa' }),
      'school-2',
    );

    expect(productsRepository.items).toHaveLength(2);
  });
});
