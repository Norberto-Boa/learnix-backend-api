import { productFactory } from '@test/factories/product.factory';
import { InMemoryProductsRepository } from '../repositories/in-memory/in-memory-products.repository';
import { FetchProductsUseCase } from '../use-cases/fetch-products.use-case';

let productsRepository: InMemoryProductsRepository;
let sut: FetchProductsUseCase;

describe('FetchProductsUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new FetchProductsUseCase(productsRepository);
  });

  it('Should be able to fetch products', async () => {
    await productsRepository.save(productFactory(), 'school-1');
    await productsRepository.save(productFactory(), 'school-1');
    await productsRepository.save(productFactory(), 'school-1');

    const result = await sut.execute(
      {
        limit: 10,
        page: 1,
      },
      'school-1',
    );

    expect(result.products).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('Should be able to fetch products with pagination', async () => {
    await productsRepository.save(productFactory(), 'school-1');
    await productsRepository.save(productFactory(), 'school-1');
    await productsRepository.save(productFactory(), 'school-1');

    const result = await sut.execute(
      {
        limit: 2,
        page: 2,
      },
      'school-1',
    );

    expect(result.products).toHaveLength(1);
    expect(result.total).toBe(3);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.totalPages).toBe(2);
  });

  it('Should be able to search products by name', async () => {
    await productsRepository.save(
      productFactory({
        name: 'School Uniform',
      }),
      'school-1',
    );
    await productsRepository.save(
      productFactory({
        name: 'School Tie',
      }),
      'school-1',
    );
    await productsRepository.save(productFactory(), 'school-1');

    const result = await sut.execute(
      {
        limit: 10,
        page: 1,
        search: 'school',
      },
      'school-1',
    );

    expect(result.products).toHaveLength(2);
  });

  it('Should be able to fetch products from the same school', async () => {
    await productsRepository.save(productFactory(), 'school-1');
    await productsRepository.save(productFactory(), 'school-2');
    await productsRepository.save(productFactory(), 'school-3');

    const result = await sut.execute(
      {
        limit: 10,
        page: 1,
      },
      'school-1',
    );

    expect(result.products).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('Should be able to fetch products with pagination', async () => {
    await productsRepository.save(productFactory(), 'school-1');
    await productsRepository.save(productFactory(), 'school-1');
    const deleted = await productsRepository.save(productFactory(), 'school-1');

    await productsRepository.delete(deleted.id, 'school-1');

    const result = await sut.execute(
      {
        limit: 10,
        page: 1,
      },
      'school-1',
    );

    expect(result.products).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });
});
