import { UpdateProductUseCase } from '../use-cases/update-product.use-case';
import { InMemoryProductsRepository } from '../repositories/in-memory/in-memory-products.repository';
import { productFactory } from '@test/factories/product.factory';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { ProductAlreadyExistsError } from '../errors/product-already-exists.error';

let productsRepository: InMemoryProductsRepository;
let sut: UpdateProductUseCase;

describe('UpdateProductUseCase', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository();
    sut = new UpdateProductUseCase(productsRepository);
  });

  it('Should be able to update a school from the same school', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    const result = await sut.execute(
      { id: product.id, name: 'Uniform', price: 2500 },
      'school-1',
    );

    expect(result.newProduct.id).equal(result.oldProduct.id);
    expect(result.newProduct.name).toBe('Uniform');
  });

  it('Should be able to update only one field', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    const result = await sut.execute(
      { id: product.id, name: 'Uniform' },
      'school-1',
    );

    expect(result.newProduct.name).toBe('Uniform');
    expect(result.newProduct.code).toBe(product.code);
  });

  it('Should not be able to update non-existent product', async () => {
    await expect(() =>
      sut.execute({ id: 'non-existent-product', name: 'Uniform' }, 'school-1'),
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  it('Should not be able to update product from another school!', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    await expect(() =>
      sut.execute({ id: product.id, name: 'Uniform' }, 'school-2'),
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  it('should not be able to update product name to another existing product name in the same school', async () => {
    await productsRepository.save(
      {
        name: 'Uniform',
        code: 'UNIFORM',
        price: 3500,
      },
      'school-1',
    );

    const product = await productsRepository.save(
      {
        name: 'Book',
        code: 'BOOK',
        price: 1000,
      },
      'school-1',
    );

    await expect(() =>
      sut.execute(
        {
          id: product.id,
          name: 'Uniform',
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(ProductAlreadyExistsError);
  });
});
