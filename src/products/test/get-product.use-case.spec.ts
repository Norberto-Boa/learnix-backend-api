import { InMemoryProductsRepository } from '../repositories/in-memory/in-memory-products.repository';
import { GetProductUseCase } from '../use-cases/get-product.use-case';
import { productFactory } from '../../../test/factories/product.factory';
import { ProductNotFoundError } from '../errors/product-not-found.error';

let productsRepository: InMemoryProductsRepository;
let sut: GetProductUseCase;

describe('GetProductUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new GetProductUseCase(productsRepository);
  });

  it('Should be able to get a a product', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    const result = await sut.execute({ id: product.id }, 'school-1');

    expect(result.product.id).toBe(product.id);
  });

  it('Should not be able to a get a nonexistent product', async () => {
    await expect(() =>
      sut.execute({ id: 'non-existent-product-id' }, 'school-1'),
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  it('Should not be able to a get a product form another school', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    await expect(() =>
      sut.execute({ id: product.id }, 'school-2'),
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  it('Should not be able to a get a deleted product', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    await productsRepository.delete(product.id, 'school-1');

    await expect(() =>
      sut.execute({ id: product.id }, 'school-1'),
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });
});
